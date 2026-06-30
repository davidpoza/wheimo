package com.wheimo.api.domain.dto;

import lombok.Builder;

import java.time.OffsetDateTime;
import java.util.Map;

@Builder
public record PriceTrackerDto(
        Long id,
        String name,
        String fetcherType,
        Map<String, Object> params,
        boolean active,
        OffsetDateTime createdAt
) {}
