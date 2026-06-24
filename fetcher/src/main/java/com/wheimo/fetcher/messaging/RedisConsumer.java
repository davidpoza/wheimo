package com.wheimo.fetcher.messaging;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.wheimo.fetcher.dto.SyncRequestMessage;
import com.wheimo.fetcher.service.ImportService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class RedisConsumer implements MessageListener {

    private final ObjectMapper objectMapper;
    private final ImportService importService;

    @Override
    public void onMessage(Message message, byte[] pattern) {
        try {
            String json = new String(message.getBody());
            SyncRequestMessage request = objectMapper.readValue(json, SyncRequestMessage.class);
            log.info("Received sync request for account {}", request.getAccountId());
            importService.process(request);
        } catch (Exception e) {
            log.error("Failed to process sync request", e);
        }
    }
}
