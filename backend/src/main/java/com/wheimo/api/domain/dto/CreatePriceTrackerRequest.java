package com.wheimo.api.domain.dto;

import jakarta.validation.constraints.NotBlank;

import java.util.Map;

public record CreatePriceTrackerRequest(
        @NotBlank String name,
        @NotBlank String fetcherType,
        Map<String, Object> params
) {}
