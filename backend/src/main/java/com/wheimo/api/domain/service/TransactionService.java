package com.wheimo.api.domain.service;

import com.wheimo.api.domain.dto.*;
import com.wheimo.api.domain.entity.*;
import com.wheimo.api.domain.entity.MovementType;
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
import java.util.regex.Pattern;
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
    private final RecurrentTransactionLinkRepository recurrentLinkRepository;
    private final AccountExceptionRepository accountExceptionRepository;

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

        if (!req.isDraft() && req.getBalance() == null && account.isKeepBalance()) {
            account.setBalance(newBalance);
            accountRepository.save(account);
        }

        return toDto(transaction);
    }

    public TransactionPageDto findAll(Long userId, TransactionFilterParams params) {
        Specification<Transaction> spec = buildSpec(userId, params);
        String sortField = "date";
        Sort.Direction sortDir = Sort.Direction.DESC;
        if (params.getSort() != null) {
            String[] parts = params.getSort().split(",", 2);
            sortField = parts[0];
            if (parts.length > 1 && "asc".equalsIgnoreCase(parts[1])) {
                sortDir = Sort.Direction.ASC;
            }
        }
        Sort sort = Sort.by(sortDir, sortField);

        if (params.getLimit() != null) {
            int offset = params.getOffset() != null ? params.getOffset() : 0;
            var page = transactionRepository.findAll(spec, PageRequest.of(offset / params.getLimit(), params.getLimit(), sort));
            return new TransactionPageDto(page.stream().map(this::toDto).toList(), page.getTotalElements());
        }
        var list = transactionRepository.findAll(spec, sort).stream().map(this::toDto).toList();
        return new TransactionPageDto(list, list.size());
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

    public List<TagExpenseDto> calculateExpensesByTags(Long userId, Long accountId, OffsetDateTime from, OffsetDateTime to) {
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
        if (transactions.isEmpty()) return new ArrayList<>();

        // Preserve insertion order: untagged bucket first, then tags as encountered.
        Map<Long, TagExpenseDto> byTag = new LinkedHashMap<>();
        byTag.put(-1L, new TagExpenseDto(-1L, "non-tagged", BigDecimal.ZERO));

        for (Transaction t : transactions) {
            if (t.getTags().isEmpty()) {
                TagExpenseDto cur = byTag.get(-1L);
                byTag.put(-1L, new TagExpenseDto(-1L, "non-tagged", cur.amount().add(t.getAmount())));
            } else {
                for (Tag tag : t.getTags()) {
                    TagExpenseDto cur = byTag.computeIfAbsent(tag.getId(),
                            k -> new TagExpenseDto(tag.getId(), tag.getName(), BigDecimal.ZERO));
                    byTag.put(tag.getId(), new TagExpenseDto(tag.getId(), tag.getName(), cur.amount().add(t.getAmount())));
                }
            }
        }

        // Drop the untagged bucket if it has no expenses.
        if (byTag.get(-1L).amount().signum() == 0) byTag.remove(-1L);
        return new ArrayList<>(byTag.values());
    }

    public Map<String, BigDecimal> calculateCalendar(Long userId, Long accountId, int year) {
        OffsetDateTime from = OffsetDateTime.parse(year + "-01-01T00:00:00Z");
        OffsetDateTime to = OffsetDateTime.parse(year + "-12-31T23:59:59.999999999Z");

        Specification<Transaction> spec = (root, q, cb) -> {
            var preds = new ArrayList<>();
            preds.add(cb.equal(root.get("account").get("user").get("id"), userId));
            if (accountId != null) preds.add(cb.equal(root.get("account").get("id"), accountId));
            preds.add(cb.greaterThanOrEqualTo(root.get("date"), from));
            preds.add(cb.lessThanOrEqualTo(root.get("date"), to));
            return cb.and(preds.toArray(new jakarta.persistence.criteria.Predicate[0]));
        };

        Map<String, BigDecimal> result = new LinkedHashMap<>();
        for (Transaction t : transactionRepository.findAll(spec)) {
            String day = t.getDate().toLocalDate().toString();
            result.merge(day, t.getAmount(), BigDecimal::add);
        }
        return result;
    }

    public StatisticsDto calculateStatistics(Long userId, Long accountId, OffsetDateTime from, OffsetDateTime to) {
        Specification<Transaction> spec = (root, q, cb) -> {
            var preds = new ArrayList<>();
            preds.add(cb.equal(root.get("account").get("user").get("id"), userId));
            if (accountId != null) preds.add(cb.equal(root.get("account").get("id"), accountId));
            if (from != null) preds.add(cb.greaterThanOrEqualTo(root.get("date"), from));
            if (to != null) preds.add(cb.lessThanOrEqualTo(root.get("date"), to));
            return cb.and(preds.toArray(new jakarta.persistence.criteria.Predicate[0]));
        };

        List<Transaction> transactions = transactionRepository.findAll(spec);
        if (transactions.isEmpty()) {
            return new StatisticsDto(null, 0, 0, BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO);
        }

        BigDecimal totalIncome = BigDecimal.ZERO;
        BigDecimal totalExpenses = BigDecimal.ZERO;
        // Per-day expense totals (sum of negative amounts), keyed by date.
        Map<java.time.LocalDate, BigDecimal> dailyExpenses = new HashMap<>();

        for (Transaction t : transactions) {
            BigDecimal amount = t.getAmount();
            if (amount.signum() > 0) {
                totalIncome = totalIncome.add(amount);
            } else if (amount.signum() < 0) {
                totalExpenses = totalExpenses.add(amount);
                dailyExpenses.merge(t.getDate().toLocalDate(), amount, BigDecimal::add);
            }
        }

        // Most expensive day = day with the largest single-day expense (most negative total).
        StatisticsDto.MostExpensiveDay mostExpensiveDay = dailyExpenses.entrySet().stream()
                .min(Map.Entry.comparingByValue())
                .map(e -> new StatisticsDto.MostExpensiveDay(e.getKey(), e.getValue()))
                .orElse(null);

        // Streaks: consecutive calendar days that have at least one expense.
        List<java.time.LocalDate> expenseDays = new ArrayList<>(dailyExpenses.keySet());
        Collections.sort(expenseDays);
        int longestStreak = 0;
        int currentStreak = 0;
        java.time.LocalDate prev = null;
        for (java.time.LocalDate day : expenseDays) {
            if (prev != null && prev.plusDays(1).equals(day)) {
                currentStreak++;
            } else {
                currentStreak = 1;
            }
            longestStreak = Math.max(longestStreak, currentStreak);
            prev = day;
        }

        // Average daily expense over the number of days in the range (inclusive).
        BigDecimal avgDailyExpense = BigDecimal.ZERO;
        if (from != null && to != null) {
            long days = java.time.temporal.ChronoUnit.DAYS.between(from.toLocalDate(), to.toLocalDate()) + 1;
            if (days > 0) {
                avgDailyExpense = totalExpenses.divide(BigDecimal.valueOf(days), 2, java.math.RoundingMode.HALF_UP);
            }
        }

        return new StatisticsDto(mostExpensiveDay, currentStreak, longestStreak, totalIncome, totalExpenses, avgDailyExpense);
    }

    @Transactional
    public int processImportResult(SyncResultMessage msg) {
        if (msg.getError() != null) {
            log.error("Sync error for account {}: {}", msg.getAccountId(), msg.getError());
            return 0;
        }
        Account account = accountRepository.findById(msg.getAccountId()).orElse(null);
        if (account == null) return 0;

        MovementType movementType = account.getMovementType() != null ? account.getMovementType() : MovementType.BOTH;

        List<Pattern> exceptionPatterns = accountExceptionRepository.findByAccountId(account.getId()).stream()
                .map(e -> {
                    try {
                        return Pattern.compile(e.getRegex(), Pattern.CASE_INSENSITIVE);
                    } catch (Exception ex) {
                        log.warn("Skipping invalid account exception regex '{}' for account {}: {}", e.getRegex(), account.getId(), ex.getMessage());
                        return null;
                    }
                })
                .filter(Objects::nonNull)
                .toList();

        List<Transaction> newTransactions = new ArrayList<>();
        for (SyncResultMessage.ImportedTransaction it : msg.getTransactions()) {
            if (transactionRepository.existsByImportId(it.getImportId())) continue;
            if (movementType == MovementType.INCOME && it.getAmount().signum() <= 0) continue;
            if (movementType == MovementType.EXPENSE && it.getAmount().signum() >= 0) continue;
            if (matchesException(it.getDescription(), exceptionPatterns)) continue;
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
            if (msg.getBalance() != null && account.isKeepBalance()) {
                account.setBalance(msg.getBalance());
                accountRepository.save(account);
            }
        }
        return newTransactions.size();
    }

    private boolean matchesException(String description, List<Pattern> patterns) {
        if (description == null || patterns.isEmpty()) return false;
        return patterns.stream().anyMatch(p -> p.matcher(description).find());
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
        List<RecurrentLinkDto> recurrentLinks = recurrentLinkRepository.findByTransactionId(t.getId())
                .stream()
                .map(l -> RecurrentLinkDto.builder()
                        .recurrentId(l.getRecurrent().getId())
                        .transactionId(t.getId())
                        .name(l.getRecurrent().getName())
                        .establishment(l.getRecurrent().getEstablishment())
                        .amountSnapshot(l.getAmountSnapshot().negate())
                        .unitsSnapshot(l.getUnitsSnapshot())
                        .transactionDate(t.getDate())
                        .transactionAmount(t.getAmount())
                        .build())
                .toList();
        BigDecimal recurrentsTotal = recurrentLinks.stream()
                .map(l -> l.getUnitsSnapshot() != null
                        ? l.getAmountSnapshot().multiply(l.getUnitsSnapshot())
                        : l.getAmountSnapshot())
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal recurrentsDiff = t.getAmount() != null ? recurrentsTotal.subtract(t.getAmount()) : BigDecimal.ZERO;

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
                        .id(a.getId()).filename(a.getFilename()).originalFilename(a.getOriginalFilename())
                        .description(a.getDescription())
                        .type(a.getType()).transactionId(t.getId()).createdAt(a.getCreatedAt()).build()).toList())
                .recurrents(recurrentLinks)
                .recurrentsTotal(recurrentsTotal)
                .recurrentsDiff(recurrentsDiff)
                .createdAt(t.getCreatedAt())
                .updatedAt(t.getUpdatedAt())
                .build();
    }
}
