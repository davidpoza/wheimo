package com.wheimo.fetcher.messaging;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.wheimo.fetcher.dto.SyncResultMessage;
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

    @Value("${app.redis.sync-results-channel}")
    private String syncResultsChannel;

    public void publishResult(SyncResultMessage message) {
        try {
            String json = objectMapper.writeValueAsString(message);
            redisTemplate.convertAndSend(syncResultsChannel, json);
            log.info("Published sync result for account {} to channel {}", message.getAccountId(), syncResultsChannel);
        } catch (Exception e) {
            log.error("Failed to publish sync result", e);
        }
    }
}
