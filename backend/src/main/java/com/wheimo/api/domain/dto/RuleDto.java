package com.wheimo.api.domain.dto;

import lombok.Builder;
import lombok.Data;

import java.time.OffsetDateTime;
import java.util.List;

@Data @Builder
public class RuleDto {
    private Long id;
    private String name;
    private String type;
    private String value;
    private List<TagDto> tags;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
}
