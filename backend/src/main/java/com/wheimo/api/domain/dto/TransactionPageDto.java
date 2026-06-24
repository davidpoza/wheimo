package com.wheimo.api.domain.dto;

import java.util.List;

public record TransactionPageDto(List<TransactionDto> data, long total) {}
