package com.wheimo.api.domain.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Data @Builder
public class BudgetDto {
    private Long id;
    private BigDecimal value;
    private OffsetDateTime startDate;
    private OffsetDateTime endDate;
    private TagDto tag;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
}
