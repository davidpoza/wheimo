package com.wheimo.api.domain.dto;

import lombok.Builder;
import lombok.Data;

import java.util.Map;

@Data @Builder
public class SyncRequestMessage {
    private Long accountId;
    private Long userId;
    private String from;
    private String bankId;
    private String accessId;
    private String encryptedPassword;
    private Map<String, String> settings;
}
