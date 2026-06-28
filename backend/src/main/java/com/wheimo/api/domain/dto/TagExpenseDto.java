package com.wheimo.api.domain.dto;

import java.math.BigDecimal;

public record TagExpenseDto(Long tagId, String tagName, BigDecimal amount) {}
