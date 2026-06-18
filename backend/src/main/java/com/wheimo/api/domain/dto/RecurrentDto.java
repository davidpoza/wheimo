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
    private String emitter;
    private Long transactionId;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
}
