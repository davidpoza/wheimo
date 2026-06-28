package com.wheimo.api.domain.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Data @Builder
public class RecurrentDto {
    private Long id;
    private String name;
    private BigDecimal amount;
    private BigDecimal units;
    private String establishment;
    private Integer periodicity;
    private String periodicityType;
    private Integer periodicityMonth;
    private String link;
    private OffsetDateTime nextPredictedDate;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
}
