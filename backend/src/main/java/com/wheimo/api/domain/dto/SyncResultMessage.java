package com.wheimo.api.domain.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;

@Data
public class SyncResultMessage {
    private Long accountId;
    private Long userId;
    private String error;
    private BigDecimal balance;
    private List<ImportedTransaction> transactions;

    @Data
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
