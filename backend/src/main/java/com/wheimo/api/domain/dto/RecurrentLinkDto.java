package com.wheimo.api.domain.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Data @Builder
public class RecurrentLinkDto {
    private Long recurrentId;
    private Long transactionId;
    private String name;
    private String establishment;
    private BigDecimal amountSnapshot;
    private BigDecimal unitsSnapshot;
    private OffsetDateTime transactionDate;
    private BigDecimal transactionAmount;
}
