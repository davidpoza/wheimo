package com.wheimo.api.domain.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SignUpRequest {
    @Email @NotBlank
    private String email;
    @NotBlank
    private String password;
    private String name;
}
