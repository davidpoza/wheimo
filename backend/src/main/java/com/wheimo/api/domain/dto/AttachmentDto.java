package com.wheimo.api.domain.dto;

import lombok.Builder;
import lombok.Data;

import java.time.OffsetDateTime;

@Data @Builder
public class AttachmentDto {
    private Long id;
    private String filename;
    private String description;
    private String type;
    private Long transactionId;
    private OffsetDateTime createdAt;
}
