package com.wheimo.api.domain.dto;

import lombok.Builder;

import java.math.BigDecimal;
import java.time.LocalDate;

@Builder
public record PriceReadingDto(
        Long id,
        LocalDate readingDate,
        String locationKey,
        BigDecimal value
) {}
