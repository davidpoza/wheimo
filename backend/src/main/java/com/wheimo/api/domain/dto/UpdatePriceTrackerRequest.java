package com.wheimo.api.domain.dto;

import java.util.Map;

public record UpdatePriceTrackerRequest(
        String name,
        String fetcherType,
        Map<String, Object> params,
        Boolean active
) {}
