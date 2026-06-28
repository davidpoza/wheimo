package com.wheimo.api.domain.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record StatisticsDto(
        MostExpensiveDay mostExpensiveDay,
        int currentStreak,
        int longestStreak,
        BigDecimal totalIncome,
        BigDecimal totalExpenses,
        BigDecimal avgDailyExpense) {

    public record MostExpensiveDay(LocalDate date, BigDecimal amount) {}
}
