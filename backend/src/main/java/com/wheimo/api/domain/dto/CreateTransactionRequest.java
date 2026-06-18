package com.wheimo.api.domain.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;

@Data
public class CreateTransactionRequest {
    @NotNull private Long accountId;
    @NotNull private BigDecimal amount;
    private String assCard;
    private BigDecimal balance;
    private String comments;
    @NotBlank private String currency;
    @NotNull private OffsetDateTime date;
    private String description;
    private String emitterName;
    private boolean receipt;
    private boolean draft;
    private String receiverName;
    private List<Long> tags;
    @NotNull private OffsetDateTime valueDate;
}
