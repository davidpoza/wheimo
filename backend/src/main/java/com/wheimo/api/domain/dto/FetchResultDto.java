package com.wheimo.api.domain.dto;

import lombok.Builder;

import java.util.List;

@Builder
public record FetchResultDto(
        Long trackerId,
        String status,
        Integer newReadings,
        String message,
        Integer triggered,
        List<FetchResultDto> results
) {}
