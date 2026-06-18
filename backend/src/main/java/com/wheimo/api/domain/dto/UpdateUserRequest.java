package com.wheimo.api.domain.dto;

import lombok.Data;

@Data
public class UpdateUserRequest {
    private String lang;
    private String theme;
    private Long ignoredTagId;
}
