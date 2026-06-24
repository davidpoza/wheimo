package com.wheimo.api.domain.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class FixBalancesRequest {
    @NotNull private Long accountId;
    @NotNull private Long fromTransactionId;
    private BigDecimal initialBalance;
    private boolean onlyRegenerateImportId;
}
