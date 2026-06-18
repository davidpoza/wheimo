package com.wheimo.api.domain.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;

@Data @Builder
public class TransactionFilterParams {
    private Long accountId;
    private OffsetDateTime from;
    private OffsetDateTime to;
    private List<Long> tags;
    private String search;
    private BigDecimal min;
    private BigDecimal max;
    private String operationType;
    private Boolean isFav;
    private Boolean isDraft;
    private Boolean hasAttachments;
    private List<Long> ids;
    private Integer limit;
    private Integer offset;
    private String sort;
}
