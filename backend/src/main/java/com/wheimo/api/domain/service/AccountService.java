package com.wheimo.api.domain.service;

import com.wheimo.api.domain.dto.*;
import com.wheimo.api.domain.entity.Account;
import com.wheimo.api.domain.entity.MovementType;
import com.wheimo.api.domain.entity.Transaction;
import com.wheimo.api.domain.entity.User;
import com.wheimo.api.domain.repository.AccountRepository;
import com.wheimo.api.domain.repository.TransactionRepository;
import com.wheimo.api.domain.repository.UserRepository;
import com.wheimo.api.messaging.RedisPublisher;
import com.wheimo.api.web.exception.ForbiddenException;
import com.wheimo.api.web.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.HexFormat;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AccountService {

    private static final Set<String> SUPPORTED_BANK_IDS = Set.of("opbk", "nordigen", "opbkprepaid", "wallet", "piggybank", "manual");
    private static final Set<String> SYNCABLE_BANK_IDS = Set.of("opbk", "nordigen", "opbkprepaid");

    private final AccountRepository accountRepository;
    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;
    private final EncryptionService encryptionService;
    private final RedisPublisher redisPublisher;

    public AccountDto create(Long userId, CreateAccountRequest req) {
        if (!SUPPORTED_BANK_IDS.contains(req.getBankId())) {
            throw new IllegalArgumentException("Unsupported bankId: " + req.getBankId());
        }
        User user = userRepository.findById(userId).orElseThrow(() -> new NotFoundException("User not found"));
        Account account = Account.builder()
                .name(req.getName())
                .number(req.getNumber())
                .description(req.getDescription())
                .bankId(req.getBankId())
                .accessId(req.getAccessId())
                .accessPassword(req.getAccessPassword() != null ? encryptionService.encrypt(req.getAccessPassword()) : null)
                .settings(req.getSettings())
                .movementType(req.getMovementType() != null ? req.getMovementType() : MovementType.BOTH)
                .user(user)
                .build();
        return toDto(accountRepository.save(account));
    }

    public List<AccountDto> findAll(Long userId) {
        return accountRepository.findByUserId(userId).stream().map(this::toDto).toList();
    }

    public AccountDto findById(Long id, Long userId) {
        return toDto(getAccount(id, userId));
    }

    @Transactional
    public AccountDto updateById(Long id, Long userId, UpdateAccountRequest req) {
        Account account = getAccount(id, userId);
        if (req.getName() != null) account.setName(req.getName());
        if (req.getNumber() != null) account.setNumber(req.getNumber());
        if (req.getDescription() != null) account.setDescription(req.getDescription());
        if (req.getBalance() != null) account.setBalance(req.getBalance());
        if (req.getBankId() != null) account.setBankId(req.getBankId());
        if (req.getAccessId() != null) account.setAccessId(req.getAccessId());
        if (req.getAccessPassword() != null) account.setAccessPassword(encryptionService.encrypt(req.getAccessPassword()));
        if (req.getSettings() != null) account.setSettings(req.getSettings());
        if (req.getSavingTargetAmount() != null) account.setSavingTargetAmount(req.getSavingTargetAmount());
        if (req.getSavingInitialAmount() != null) account.setSavingInitialAmount(req.getSavingInitialAmount());
        if (req.getSavingAmountFunc() != null) account.setSavingAmountFunc(req.getSavingAmountFunc());
        if (req.getSavingFrequency() != null) account.setSavingFrequency(req.getSavingFrequency());
        if (req.getSavingInitDate() != null) account.setSavingInitDate(req.getSavingInitDate());
        if (req.getSavingTargetDate() != null) account.setSavingTargetDate(req.getSavingTargetDate());
        if (req.getMovementType() != null) account.setMovementType(req.getMovementType());
        return toDto(accountRepository.save(account));
    }

    public void deleteById(Long id, Long userId) {
        Account account = getAccount(id, userId);
        accountRepository.delete(account);
    }

    public void triggerResync(Long id, Long userId, String from) {
        Account account = getAccount(id, userId);
        if (!SYNCABLE_BANK_IDS.contains(account.getBankId())) {
            throw new IllegalArgumentException("Cannot sync manual accounts (wallet/piggybank)");
        }
        if (account.getAccessId() == null || account.getAccessPassword() == null) {
            throw new IllegalArgumentException("Account missing accessId or accessPassword");
        }
        SyncRequestMessage msg = SyncRequestMessage.builder()
                .accountId(account.getId())
                .userId(userId)
                .from(from)
                .bankId(account.getBankId())
                .accessId(account.getAccessId())
                .encryptedPassword(account.getAccessPassword())
                .settings(account.getSettings())
                .build();
        redisPublisher.publishSyncRequest(msg);
    }

    @Transactional
    public void fixBalances(Long accountId, Long userId, Long fromTransactionId, BigDecimal initialBalance, boolean onlyRegenerateImportId) {
        getAccount(accountId, userId);
        List<Transaction> transactions = transactionRepository.findByAccountIdAndUserId(accountId, userId);
        boolean started = false;
        BigDecimal runningBalance = initialBalance != null ? initialBalance : BigDecimal.ZERO;

        for (int i = transactions.size() - 1; i >= 0; i--) {
            Transaction t = transactions.get(i);
            if (t.getId().equals(fromTransactionId)) started = true;
            if (!started) continue;

            if (!onlyRegenerateImportId) {
                runningBalance = runningBalance.add(t.getAmount());
                t.setBalance(runningBalance);
            }
            t.setImportId(generateImportId(accountId, t.getBalance(), t.getDate() != null ? t.getDate().toLocalDate().toString() : "", t.getDescription(), t.getAmount()));
            transactionRepository.save(t);
        }
    }

    private Account getAccount(Long id, Long userId) {
        return accountRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new NotFoundException("Account not found"));
    }

    private String generateImportId(Long accountId, BigDecimal balance, String date, String description, BigDecimal amount) {
        try {
            String raw = accountId + "|" + balance + "|" + date + "|" + description + "|" + amount;
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hash = md.digest(raw.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (Exception e) {
            return accountId + "_" + System.currentTimeMillis();
        }
    }

    public AccountDto toDto(Account account) {
        return AccountDto.builder()
                .id(account.getId())
                .number(account.getNumber())
                .name(account.getName())
                .description(account.getDescription())
                .balance(account.getBalance())
                .bankId(account.getBankId())
                .accessId(account.getAccessId())
                .settings(account.getSettings())
                .savingTargetAmount(account.getSavingTargetAmount())
                .savingInitialAmount(account.getSavingInitialAmount())
                .savingAmountFunc(account.getSavingAmountFunc())
                .savingFrequency(account.getSavingFrequency())
                .savingInitDate(account.getSavingInitDate())
                .savingTargetDate(account.getSavingTargetDate())
                .movementType(account.getMovementType())
                .lastSyncCount(account.getLastSyncCount())
                .userId(account.getUser().getId())
                .createdAt(account.getCreatedAt())
                .updatedAt(account.getUpdatedAt())
                .build();
    }
}
