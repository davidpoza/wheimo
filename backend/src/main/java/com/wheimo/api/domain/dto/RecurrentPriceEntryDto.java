package com.wheimo.api.domain.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Data @Builder
public class RecurrentPriceEntryDto {
    private Long id;
    private BigDecimal amount;
    private BigDecimal units;
    private OffsetDateTime recordedAt;
}
