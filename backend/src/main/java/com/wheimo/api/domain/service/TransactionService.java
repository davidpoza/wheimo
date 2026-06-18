package com.wheimo.api.domain.service;

import com.wheimo.api.domain.dto.*;
import com.wheimo.api.domain.entity.*;
import com.wheimo.api.domain.repository.*;
import com.wheimo.api.web.exception.ForbiddenException;
import com.wheimo.api.web.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final AccountRepository accountRepository;
    private final TagRepository tagRepository;
    private final AttachmentRepository attachmentRepository;
    private final RuleService ruleService;
    private final RuleRepository ruleRepository;
    private final UserRepository userRepository;

    @Transactional
    public TransactionDto create(Long userId, CreateTransactionRequest req) {
        Account account = accountRepository.findByIdAndUserId(req.getAccountId(), userId)
                .orElseThrow(() -> new ForbiddenException("Account not owned by user"));

        BigDecimal newBalance = account.getBalance();
        if (req.getBalance() != null) {
            newBalance = req.getBalance();
        } else if (!req.isDraft()) {
            newBalance = account.getBalance().add(req.getAmount());
        }

        String importId = generateImportId(req.getAccountId(), newBalance,
                req.getDate().toLocalDate().toString(), req.getDescription(), req.getAmount());

        Transaction transaction = Transaction.builder()
                .importId(importId)
                .accountId(req.getAccountId())
                .amount(req.getAmount())
                .assCard(req.getAssCard())
                .balance(newBalance)
                .comments(req.getComments())
                .currency(req.getCurrency())
                .date(req.getDate())
                .description(req.getDescription())
                .emitterName(req.getEmitterName())
                .receipt(req.isReceipt())
                .draft(req.isDraft())
                .receiverName(req.getReceiverName())
                .valueDate(req.getValueDate())
                .account(account)
                .build();

        transaction = transactionRepository.save(transaction);

        if (req.getTags() != null && !req.getTags().isEmpty()) {
            List<Tag> tags = tagRepository.findAllById(req.getTags());
            transaction.setTags(tags);
            transaction = transactionRepository.save(transaction);
        }

        if (!req.isDraft() && req.getBalance() == null) {
            account.setBalance(newBalance);
            accountRepository.save(account);
        }

        return toDto(transaction);
    }

    public List<TransactionDto> findAll(Long userId, TransactionFilterParams params) {
        Specification<Transaction> spec = buildSpec(userId, params);
        Sort sort = Sort.by(params.getSort() != null && "asc".equals(params.getSort()) ? Sort.Direction.ASC : Sort.Direction.DESC, "date");

        if (params.getLimit() != null) {
            int offset = params.getOffset() != null ? params.getOffset() : 0;
            var page = transactionRepository.findAll(spec, PageRequest.of(offset / params.getLimit(), params.getLimit(), sort));
            return page.stream().map(this::toDto).toList();
        }
        return transactionRepository.findAll(spec, sort).stream().map(this::toDto).toList();
    }

    public TransactionDto findById(Long id, Long userId) {
        Transaction t = transactionRepository.findByIdWithDetails(id, userId)
                .orElseThrow(() -> new NotFoundException("Transaction not found"));
        return toDto(t);
    }

    @Transactional
    public TransactionDto updateById(Long id, Long userId, UpdateTransactionRequest req) {
        Transaction t = transactionRepository.findByIdAndAccountUserId(id, userId)
                .orElseThrow(() -> new NotFoundException("Transaction not found"));

        if (req.getAmount() != null) t.setAmount(req.getAmount());
        if (req.getAssCard() != null) t.setAssCard(req.getAssCard());
        if (req.getBalance() != null) t.setBalance(req.getBalance());
        if (req.getComments() != null) t.setComments(req.getComments());
        if (req.getCurrency() != null) t.setCurrency(req.getCurrency());
        if (req.getDate() != null) t.setDate(req.getDate());
        if (req.getDescription() != null) t.setDescription(req.getDescription());
        if (req.getEmitterName() != null) t.setEmitterName(req.getEmitterName());
        if (req.getFavourite() != null) t.setFavourite(req.getFavourite());
        if (req.getReceipt() != null) t.setReceipt(req.getReceipt());
        if (req.getDraft() != null) t.setDraft(req.getDraft());
        if (req.getReceiverName() != null) t.setReceiverName(req.getReceiverName());
        if (req.getValueDate() != null) t.setValueDate(req.getValueDate());

        if (req.getTags() != null) {
            t.setTags(tagRepository.findAllById(req.getTags()));
        }

        if (req.getAttachments() != null) {
            for (Long attId : req.getAttachments()) {
                attachmentRepository.findById(attId).ifPresent(a -> a.setTransaction(t));
            }
        }

        return toDto(transactionRepository.save(t));
    }

    @Transactional
    public void deleteById(Long id, Long userId) {
        Transaction t = transactionRepository.findByIdAndAccountUserId(id, userId)
                .orElseThrow(() -> new NotFoundException("Transaction not found"));
        transactionRepository.delete(t);
    }

    @Transactional
    public void deleteByIds(List<Long> ids, Long userId) {
        List<Transaction> transactions = transactionRepository.findAllByIdsAndUserId(ids, userId);
        transactionRepository.deleteAll(transactions);
    }

    @Transactional
    public void applyTagsToTransaction(Long id, Long userId) {
        Transaction t = transactionRepository.findByIdAndAccountUserId(id, userId)
                .orElseThrow(() -> new NotFoundException("Transaction not found"));
        List<Rule> rules = ruleRepository.findByUserIdWithTags(userId);
        ruleService.applyTags(List.of(t), rules);
    }

    @Transactional
    public Map<Long, List<TagDto>> applySpecificTags(List<Long> ids, List<Long> tagIds, Long userId) {
        List<Transaction> transactions = transactionRepository.findAllByIdsAndUserId(ids, userId);
        List<Tag> tags = tagRepository.findAllById(tagIds);
        Map<Long, List<TagDto>> result = new HashMap<>();
        for (Transaction t : transactions) {
            for (Tag tag : tags) {
                if (!t.getTags().contains(tag)) t.getTags().add(tag);
            }
            transactionRepository.save(t);
            result.put(t.getId(), t.getTags().stream()
                    .map(tag -> TagDto.builder().id(tag.getId()).name(tag.getName()).build()).toList());
        }
        return result;
    }

    public Map<String, Object> calculateExpensesByTags(Long userId, Long accountId, OffsetDateTime from, OffsetDateTime to) {
        Specification<Transaction> spec = (root, q, cb) -> {
            var preds = new ArrayList<>();
            preds.add(cb.equal(root.get("account").get("user").get("id"), userId));
            preds.add(cb.lt(root.get("amount"), 0));
            if (accountId != null) preds.add(cb.equal(root.get("account").get("id"), accountId));
            if (from != null) preds.add(cb.greaterThanOrEqualTo(root.get("date"), from));
            if (to != null) preds.add(cb.lessThanOrEqualTo(root.get("date"), to));
            return cb.and(preds.toArray(new jakarta.persistence.criteria.Predicate[0]));
        };

        List<Transaction> transactions = transactionRepository.findAll(spec);
        Map<String, Object> result = new HashMap<>();
        result.put("-1", Map.of("name", "non-tagged", "amount", BigDecimal.ZERO));

        for (Transaction t : transactions) {
            if (t.getTags().isEmpty()) {
                Map<String, Object> untagged = (Map<String, Object>) result.get("-1");
                untagged.put("amount", ((BigDecimal) untagged.get("amount")).add(t.getAmount()));
            } else {
                for (Tag tag : t.getTags()) {
                    result.computeIfAbsent(String.valueOf(tag.getId()), k -> new HashMap<>(Map.of("name", tag.getName(), "amount", BigDecimal.ZERO)));
                    Map<String, Object> tagEntry = (Map<String, Object>) result.get(String.valueOf(tag.getId()));
                    tagEntry.put("amount", ((BigDecimal) tagEntry.get("amount")).add(t.getAmount()));
                }
            }
        }
        return result;
    }

    @Transactional
    public void processImportResult(SyncResultMessage msg) {
        if (msg.getError() != null) {
            log.error("Sync error for account {}: {}", msg.getAccountId(), msg.getError());
            return;
        }
        Account account = accountRepository.findById(msg.getAccountId()).orElse(null);
        if (account == null) return;

        List<Transaction> newTransactions = new ArrayList<>();
        for (SyncResultMessage.ImportedTransaction it : msg.getTransactions()) {
            if (transactionRepository.existsByImportId(it.getImportId())) continue;
            Transaction t = Transaction.builder()
                    .importId(it.getImportId())
                    .amount(it.getAmount())
                    .currency(it.getCurrency())
                    .date(it.getDate())
                    .valueDate(it.getValueDate())
                    .description(it.getDescription())
                    .emitterName(it.getEmitterName())
                    .receiverName(it.getReceiverName())
                    .assCard(it.getAssCard())
                    .receipt(it.isReceipt())
                    .balance(it.getBalance())
                    .account(account)
                    .build();
            newTransactions.add(transactionRepository.save(t));
        }

        if (!newTransactions.isEmpty()) {
            List<Rule> rules = ruleRepository.findByUserIdWithTags(msg.getUserId());
            ruleService.applyTags(newTransactions, rules);
            if (msg.getBalance() != null) {
                account.setBalance(msg.getBalance());
                accountRepository.save(account);
            }
        }
    }

    private Specification<Transaction> buildSpec(Long userId, TransactionFilterParams p) {
        return (root, query, cb) -> {
            var preds = new ArrayList<jakarta.persistence.criteria.Predicate>();
            preds.add(cb.equal(root.get("account").get("user").get("id"), userId));
            if (p.getAccountId() != null) preds.add(cb.equal(root.get("account").get("id"), p.getAccountId()));
            if (p.getFrom() != null) preds.add(cb.greaterThanOrEqualTo(root.get("date"), p.getFrom()));
            if (p.getTo() != null) preds.add(cb.lessThanOrEqualTo(root.get("date"), p.getTo()));
            if (p.getSearch() != null) {
                String like = "%" + p.getSearch().toLowerCase() + "%";
                preds.add(cb.or(
                        cb.like(cb.lower(root.get("description")), like),
                        cb.like(cb.lower(root.get("comments")), like),
                        cb.like(cb.lower(root.get("emitterName")), like),
                        cb.like(cb.lower(root.get("receiverName")), like)
                ));
            }
            if (p.getOperationType() != null) {
                if ("expense".equals(p.getOperationType())) preds.add(cb.lt(root.get("amount"), 0));
                else if ("income".equals(p.getOperationType())) preds.add(cb.gt(root.get("amount"), 0));
            }
            if (p.getMin() != null) preds.add(cb.greaterThanOrEqualTo(cb.abs(root.get("amount")), p.getMin()));
            if (p.getMax() != null) preds.add(cb.lessThanOrEqualTo(cb.abs(root.get("amount")), p.getMax()));
            if (Boolean.TRUE.equals(p.getIsFav())) preds.add(cb.isTrue(root.get("favourite")));
            if (p.getIsDraft() != null) preds.add(cb.equal(root.get("draft"), p.getIsDraft()));
            if (p.getTags() != null && !p.getTags().isEmpty()) {
                Join<Transaction, Tag> tagJoin = root.join("tags", JoinType.INNER);
                preds.add(tagJoin.get("id").in(p.getTags()));
                query.distinct(true);
            }
            if (p.getIds() != null && !p.getIds().isEmpty()) preds.add(root.get("id").in(p.getIds()));
            return cb.and(preds.toArray(new jakarta.persistence.criteria.Predicate[0]));
        };
    }

    private String generateImportId(Long accountId, BigDecimal balance, String date, String description, BigDecimal amount) {
        try {
            String raw = accountId + "|" + balance + "|" + date + "|" + (description != null ? description : "") + "|" + amount;
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hash = md.digest(raw.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (Exception e) {
            return accountId + "_" + System.currentTimeMillis();
        }
    }

    public TransactionDto toDto(Transaction t) {
        return TransactionDto.builder()
                .id(t.getId())
                .importId(t.getImportId())
                .emitterName(t.getEmitterName())
                .receiverName(t.getReceiverName())
                .description(t.getDescription())
                .comments(t.getComments())
                .assCard(t.getAssCard())
                .amount(t.getAmount())
                .currency(t.getCurrency())
                .date(t.getDate())
                .valueDate(t.getValueDate())
                .balance(t.getBalance())
                .receipt(t.isReceipt())
                .draft(t.isDraft())
                .favourite(t.isFavourite())
                .accountId(t.getAccount() != null ? t.getAccount().getId() : null)
                .tags(t.getTags().stream().map(tag -> TagDto.builder().id(tag.getId()).name(tag.getName()).build()).toList())
                .attachments(t.getAttachments().stream().map(a -> AttachmentDto.builder()
                        .id(a.getId()).filename(a.getFilename()).description(a.getDescription())
                        .type(a.getType()).transactionId(t.getId()).createdAt(a.getCreatedAt()).build()).toList())
                .createdAt(t.getCreatedAt())
                .updatedAt(t.getUpdatedAt())
                .build();
    }
}
