package com.wheimo.api.domain.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.Map;

@Data
public class CreateAccountRequest {
    @NotBlank private String name;
    @NotBlank private String number;
    private String description;
    @NotBlank private String bankId;
    private String accessId;
    private String accessPassword;
    private Map<String, String> settings;
}
