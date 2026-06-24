package com.wheimo.fetcher.dto;

import lombok.Data;

import java.util.Map;

@Data
public class SyncRequestMessage {
    private Long accountId;
    private Long userId;
    private String from;
    private String bankId;
    private String accessId;
    private String encryptedPassword;
    private Map<String, String> settings;
}
