package com.wheimo.api.domain.dto;

import lombok.Builder;
import lombok.Data;

@Data @Builder
public class AuthResponse {
    private String token;
    private UserDto user;
}
