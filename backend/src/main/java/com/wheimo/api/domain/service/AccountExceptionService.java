package com.wheimo.api.domain.service;

import com.wheimo.api.domain.dto.AccountExceptionDto;
import com.wheimo.api.domain.entity.Account;
import com.wheimo.api.domain.entity.AccountException;
import com.wheimo.api.domain.repository.AccountExceptionRepository;
import com.wheimo.api.domain.repository.AccountRepository;
import com.wheimo.api.web.exception.ForbiddenException;
import com.wheimo.api.web.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.regex.Pattern;
import java.util.regex.PatternSyntaxException;

@Service
@RequiredArgsConstructor
public class AccountExceptionService {

    private final AccountExceptionRepository exceptionRepository;
    private final AccountRepository accountRepository;

    public List<AccountExceptionDto> findAll(Long accountId, Long userId) {
        getAccount(accountId, userId);
        return exceptionRepository.findByAccountId(accountId).stream().map(this::toDto).toList();
    }

    public AccountExceptionDto create(Long accountId, Long userId, String regex, String description) {
        Account account = getAccount(accountId, userId);
        validateRegex(regex);
        AccountException exception = AccountException.builder()
                .account(account)
                .regex(regex)
                .description(description)
                .build();
        return toDto(exceptionRepository.save(exception));
    }

    @Transactional
    public AccountExceptionDto update(Long id, Long accountId, Long userId, String regex, String description) {
        getAccount(accountId, userId);
        AccountException exception = getException(id, accountId);
        if (regex != null) {
            validateRegex(regex);
            exception.setRegex(regex);
        }
        if (description != null) exception.setDescription(description);
        return toDto(exceptionRepository.save(exception));
    }

    public void delete(Long id, Long accountId, Long userId) {
        getAccount(accountId, userId);
        AccountException exception = getException(id, accountId);
        exceptionRepository.delete(exception);
    }

    private void validateRegex(String regex) {
        if (regex == null || regex.isBlank()) throw new IllegalArgumentException("Regex must not be empty");
        try {
            Pattern.compile(regex);
        } catch (PatternSyntaxException ex) {
            throw new IllegalArgumentException("Invalid regex: " + ex.getMessage());
        }
    }

    private Account getAccount(Long accountId, Long userId) {
        return accountRepository.findByIdAndUserId(accountId, userId)
                .orElseThrow(() -> new ForbiddenException("Account does not belong to user"));
    }

    private AccountException getException(Long id, Long accountId) {
        return exceptionRepository.findByIdAndAccountId(id, accountId)
                .orElseThrow(() -> new NotFoundException("Account exception not found"));
    }

    private AccountExceptionDto toDto(AccountException exception) {
        return AccountExceptionDto.builder()
                .id(exception.getId())
                .accountId(exception.getAccount().getId())
                .regex(exception.getRegex())
                .description(exception.getDescription())
                .createdAt(exception.getCreatedAt())
                .build();
    }
}
