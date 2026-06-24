package com.wheimo.api.domain.dto;

import lombok.Builder;
import lombok.Data;

@Data @Builder
public class UserDto {
    private Long id;
    private String email;
    private String name;
    private String lang;
    private String theme;
    private String level;
    private Long ignoredTagId;
}
