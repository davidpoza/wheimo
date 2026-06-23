package com.wheimo.api.domain.dto;

import com.wheimo.api.domain.entity.MovementType;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.Map;

@Data @Builder
public class AccountDto {
    private Long id;
    private String number;
    private String name;
    private String description;
    private BigDecimal balance;
    private String bankId;
    private String accessId;
    private Map<String, String> settings;
    private BigDecimal savingTargetAmount;
    private BigDecimal savingInitialAmount;
    private String savingAmountFunc;
    private String savingFrequency;
    private OffsetDateTime savingInitDate;
    private OffsetDateTime savingTargetDate;
    private MovementType movementType;
    private Integer lastSyncCount;
    private Long userId;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
}
