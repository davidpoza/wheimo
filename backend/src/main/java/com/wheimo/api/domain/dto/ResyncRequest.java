package com.wheimo.api.domain.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ResyncRequest {
    @NotBlank
    private String from;
}
