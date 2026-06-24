package com.wheimo.api.domain.service;

import com.wheimo.api.domain.dto.BudgetDto;
import com.wheimo.api.domain.dto.TagDto;
import com.wheimo.api.domain.entity.Budget;
import com.wheimo.api.domain.entity.Tag;
import com.wheimo.api.domain.repository.BudgetRepository;
import com.wheimo.api.domain.repository.TagRepository;
import com.wheimo.api.domain.repository.TransactionRepository;
import com.wheimo.api.web.exception.ForbiddenException;
import com.wheimo.api.web.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class BudgetService {

    private final BudgetRepository budgetRepository;
    private final TagRepository tagRepository;
    private final TransactionRepository transactionRepository;

    public BudgetDto create(Long userId, Long tagId, BigDecimal value, OffsetDateTime start, OffsetDateTime end) {
        if (start.isAfter(end)) throw new IllegalArgumentException("start must be before end");
        Tag tag = tagRepository.findByIdAndUserId(tagId, userId)
                .orElseThrow(() -> new ForbiddenException("Tag not found or not owned by user"));
        Budget budget = Budget.builder().value(value).startDate(start).endDate(end).tag(tag).build();
        return toDto(budgetRepository.save(budget));
    }

    public List<BudgetDto> findAll(Long userId) {
        return budgetRepository.findByUserId(userId).stream().map(this::toDto).toList();
    }

    public BudgetDto findById(Long id, Long userId) {
        return toDto(getBudget(id, userId));
    }

    public BudgetDto updateById(Long id, Long userId, BigDecimal value, OffsetDateTime start, OffsetDateTime end) {
        Budget budget = getBudget(id, userId);
        if (value != null) budget.setValue(value);
        if (start != null) budget.setStartDate(start);
        if (end != null) budget.setEndDate(end);
        return toDto(budgetRepository.save(budget));
    }

    public void deleteById(Long id, Long userId) {
        budgetRepository.delete(getBudget(id, userId));
    }

    public Map<String, Object> getStatus(Long id, Long userId) {
        Budget budget = getBudget(id, userId);
        BigDecimal spent = transactionRepository.sumAmountByTagAndDateRange(
                budget.getTag().getId(), budget.getStartDate(), budget.getEndDate()).orElse(BigDecimal.ZERO);
        BigDecimal remaining = budget.getValue().add(spent); // spent is negative
        double percentUsed = budget.getValue().doubleValue() > 0
                ? Math.abs(spent.doubleValue()) / budget.getValue().doubleValue() * 100 : 0;
        return Map.of("budget", toDto(budget), "spent", spent, "remaining", remaining, "percentUsed", percentUsed);
    }

    private Budget getBudget(Long id, Long userId) {
        return budgetRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new NotFoundException("Budget not found"));
    }

    private BudgetDto toDto(Budget b) {
        return BudgetDto.builder()
                .id(b.getId()).value(b.getValue()).startDate(b.getStartDate()).endDate(b.getEndDate())
                .tag(TagDto.builder().id(b.getTag().getId()).name(b.getTag().getName()).build())
                .createdAt(b.getCreatedAt()).updatedAt(b.getUpdatedAt()).build();
    }
}
