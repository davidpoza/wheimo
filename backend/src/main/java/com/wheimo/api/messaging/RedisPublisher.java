package com.wheimo.api.messaging;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class RedisPublisher {

    private final StringRedisTemplate redisTemplate;
    private final ObjectMapper objectMapper;

    @Value("${app.redis.sync-requests-channel}")
    private String syncRequestsChannel;

    public void publishSyncRequest(Object message) {
        try {
            String json = objectMapper.writeValueAsString(message);
            redisTemplate.convertAndSend(syncRequestsChannel, json);
            log.info("Published sync request to Redis channel {}", syncRequestsChannel);
        } catch (Exception e) {
            log.error("Failed to publish sync request", e);
            throw new RuntimeException("Failed to publish sync request", e);
        }
    }
}
