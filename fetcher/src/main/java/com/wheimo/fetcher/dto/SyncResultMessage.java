package com.wheimo.fetcher.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;

@Data @Builder
public class SyncResultMessage {
    private Long accountId;
    private Long userId;
    private String error;
    private BigDecimal balance;
    private List<ImportedTransaction> transactions;

    @Data @Builder
    public static class ImportedTransaction {
        private String importId;
        private BigDecimal amount;
        private String currency;
        private OffsetDateTime date;
        private OffsetDateTime valueDate;
        private String description;
        private String emitterName;
        private String receiverName;
        private String assCard;
        private boolean receipt;
        private BigDecimal balance;
    }
}
