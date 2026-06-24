package com.wheimo.api.domain.service;

import com.wheimo.api.domain.dto.RuleDto;
import com.wheimo.api.domain.dto.TagDto;
import com.wheimo.api.domain.entity.Rule;
import com.wheimo.api.domain.entity.Tag;
import com.wheimo.api.domain.entity.Transaction;
import com.wheimo.api.domain.entity.User;
import com.wheimo.api.domain.repository.RuleRepository;
import com.wheimo.api.domain.repository.TagRepository;
import com.wheimo.api.domain.repository.TransactionRepository;
import com.wheimo.api.domain.repository.UserRepository;
import com.wheimo.api.web.exception.ConflictException;
import com.wheimo.api.web.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class RuleService {

    private static final Set<String> VALID_TYPES = Set.of(
            "emitterName", "receiverName", "description", "isExpense", "amount",
            "card", "isReceipt", "account", "currency", "bankId"
    );

    private final RuleRepository ruleRepository;
    private final TagRepository tagRepository;
    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;

    public RuleDto create(Long userId, String name, String type, String value) {
        if (!VALID_TYPES.contains(type)) throw new IllegalArgumentException("Invalid rule type: " + type);
        if (ruleRepository.existsByNameAndUserId(name, userId)) throw new ConflictException("Rule name already exists");
        User user = userRepository.findById(userId).orElseThrow(() -> new NotFoundException("User not found"));
        Rule rule = Rule.builder().name(name).type(type).value(value).user(user).build();
        return toDto(ruleRepository.save(rule));
    }

    public List<RuleDto> findAll(Long userId) {
        return ruleRepository.findByUserIdWithTags(userId).stream().map(this::toDto).toList();
    }

    public RuleDto findById(Long id, Long userId) {
        return toDto(getRule(id, userId));
    }

    @Transactional
    public RuleDto updateById(Long id, Long userId, String name, String type, String value) {
        Rule rule = getRule(id, userId);
        if (name != null) rule.setName(name);
        if (type != null) rule.setType(type);
        if (value != null) rule.setValue(value);
        return toDto(ruleRepository.save(rule));
    }

    public void deleteById(Long id, Long userId) {
        Rule rule = getRule(id, userId);
        ruleRepository.delete(rule);
    }

    @Transactional
    public RuleDto addTag(Long ruleId, Long tagId, Long userId) {
        Rule rule = getRule(ruleId, userId);
        Tag tag = tagRepository.findByIdAndUserId(tagId, userId)
                .orElseThrow(() -> new NotFoundException("Tag not found"));
        if (!rule.getTags().contains(tag)) rule.getTags().add(tag);
        return toDto(ruleRepository.save(rule));
    }

    @Transactional
    public void removeTag(Long ruleId, Long tagId, Long userId) {
        Rule rule = getRule(ruleId, userId);
        rule.getTags().removeIf(t -> t.getId().equals(tagId));
        ruleRepository.save(rule);
    }

    public boolean evaluateRule(Transaction transaction, Rule rule) {
        String type = rule.getType();
        String value = rule.getValue();
        return switch (type) {
            case "emitterName" -> matches(transaction.getEmitterName(), value);
            case "receiverName" -> matches(transaction.getReceiverName(), value);
            case "description" -> matches(transaction.getDescription(), value);
            case "currency" -> value.equals(transaction.getCurrency());
            case "account" -> transaction.getAccount() != null && value.equals(transaction.getAccount().getNumber());
            case "bankId" -> transaction.getAccount() != null && value.equals(transaction.getAccount().getBankId());
            case "card" -> matches(transaction.getAssCard(), value);
            case "isReceipt" -> "true".equals(value) == transaction.isReceipt();
            case "isExpense" -> "true".equals(value) == (transaction.getAmount().doubleValue() < 0);
            case "amount" -> evaluateAmount(transaction, value);
            default -> false;
        };
    }

    public boolean evaluateRules(Transaction transaction, List<Rule> rules) {
        return rules.stream().allMatch(r -> evaluateRule(transaction, r));
    }

    @Transactional
    public List<Long> applyTags(List<Transaction> transactions, List<Rule> userRules) {
        // Group rules by tag: tagId -> list of rules that must ALL be satisfied
        Map<Long, List<Rule>> tagRules = new java.util.HashMap<>();
        for (Rule rule : userRules) {
            for (Tag tag : rule.getTags()) {
                tagRules.computeIfAbsent(tag.getId(), k -> new ArrayList<>()).add(rule);
            }
        }

        List<Long> tagged = new ArrayList<>();
        for (Transaction transaction : transactions) {
            for (Map.Entry<Long, List<Rule>> entry : tagRules.entrySet()) {
                if (evaluateRules(transaction, entry.getValue())) {
                    tagRepository.findById(entry.getKey()).ifPresent(tag -> {
                        if (!transaction.getTags().contains(tag)) {
                            transaction.getTags().add(tag);
                            transactionRepository.save(transaction);
                            log.info("Tagged transaction {} with tag {}", transaction.getId(), tag.getName());
                        }
                    });
                    tagged.add(transaction.getId());
                }
            }
        }
        return tagged;
    }

    private boolean matches(String field, String pattern) {
        if (field == null) return false;
        return Pattern.compile(pattern, Pattern.CASE_INSENSITIVE).matcher(field).find();
    }

    private boolean evaluateAmount(Transaction t, String value) {
        String[] comparisons = value.split(";");
        double abs = Math.abs(t.getAmount().doubleValue());
        for (String comp : comparisons) {
            var m = java.util.regex.Pattern.compile("(gt|gte|lt|lte|eq)(\\d+\\.?\\d*)").matcher(comp);
            if (!m.matches()) return false;
            String op = m.group(1);
            double ruleAmount = Double.parseDouble(m.group(2));
            boolean ok = switch (op) {
                case "gt" -> abs > ruleAmount;
                case "gte" -> abs >= ruleAmount;
                case "lt" -> abs < ruleAmount;
                case "lte" -> abs <= ruleAmount;
                case "eq" -> abs == ruleAmount;
                default -> false;
            };
            if (!ok) return false;
        }
        return true;
    }

    private Rule getRule(Long id, Long userId) {
        return ruleRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new NotFoundException("Rule not found"));
    }

    public RuleDto toDto(Rule rule) {
        return RuleDto.builder()
                .id(rule.getId())
                .name(rule.getName())
                .type(rule.getType())
                .value(rule.getValue())
                .tags(rule.getTags().stream().map(t -> TagDto.builder().id(t.getId()).name(t.getName()).build()).toList())
                .createdAt(rule.getCreatedAt())
                .updatedAt(rule.getUpdatedAt())
                .build();
    }
}
