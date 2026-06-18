package com.wheimo.api.domain.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.Map;

@Data
public class UpdateAccountRequest {
    private String name;
    private String number;
    private String description;
    private BigDecimal balance;
    private String bankId;
    private String accessId;
    private String accessPassword;
    private Map<String, String> settings;
    private BigDecimal savingTargetAmount;
    private BigDecimal savingInitialAmount;
    private String savingAmountFunc;
    private String savingFrequency;
    private OffsetDateTime savingInitDate;
    private OffsetDateTime savingTargetDate;
}
