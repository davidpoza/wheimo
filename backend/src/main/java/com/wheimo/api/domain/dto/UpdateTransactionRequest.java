package com.wheimo.api.domain.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;

@Data
public class UpdateTransactionRequest {
    private Long accountId;
    private BigDecimal amount;
    private String assCard;
    private BigDecimal balance;
    private String comments;
    private String currency;
    private OffsetDateTime date;
    private String description;
    private String emitterName;
    private Boolean favourite;
    private Boolean receipt;
    private Boolean draft;
    private String receiverName;
    private List<Long> tags;
    private OffsetDateTime valueDate;
    private List<Long> attachments;
    private String note;
}
