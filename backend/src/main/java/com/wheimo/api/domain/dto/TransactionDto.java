package com.wheimo.api.domain.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;

@Data @Builder
public class TransactionDto {
    private Long id;
    private String importId;
    private String emitterName;
    private String receiverName;
    private String description;
    private String comments;
    private String assCard;
    private BigDecimal amount;
    private String currency;
    private OffsetDateTime date;
    private OffsetDateTime valueDate;
    private BigDecimal balance;
    private boolean receipt;
    private boolean draft;
    private boolean favourite;
    private Long accountId;
    private List<TagDto> tags;
    private List<AttachmentDto> attachments;
    private List<RecurrentLinkDto> recurrents;
    private BigDecimal recurrentsTotal;
    private BigDecimal recurrentsDiff;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
}
