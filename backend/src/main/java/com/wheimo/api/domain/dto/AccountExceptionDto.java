package com.wheimo.api.domain.dto;

import lombok.Builder;
import lombok.Data;

import java.time.OffsetDateTime;

@Data @Builder
public class AccountExceptionDto {
    private Long id;
    private Long accountId;
    private String regex;
    private String description;
    private OffsetDateTime createdAt;
}
