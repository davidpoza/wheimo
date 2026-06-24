package com.wheimo.api.domain.dto;

import lombok.Builder;
import lombok.Data;

import java.time.OffsetDateTime;

@Data @Builder
public class TagDto {
    private Long id;
    private String name;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
}
