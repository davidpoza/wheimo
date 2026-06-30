package com.wheimo.api.domain.dto;

import lombok.Builder;

import java.util.Map;

@Builder
public record FetcherTypeDto(
        String type,
        String label,
        Map<String, Object> paramSchema
) {}
