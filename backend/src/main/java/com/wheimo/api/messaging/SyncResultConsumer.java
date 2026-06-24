package com.wheimo.api.messaging;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.wheimo.api.domain.dto.SyncResultMessage;
import com.wheimo.api.domain.service.TransactionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class SyncResultConsumer implements MessageListener {

    private final ObjectMapper objectMapper;
    private final TransactionService transactionService;

    @Override
    public void onMessage(Message message, byte[] pattern) {
        try {
            String json = new String(message.getBody());
            SyncResultMessage result = objectMapper.readValue(json, SyncResultMessage.class);
            log.info("Received sync result for account {}", result.getAccountId());
            transactionService.processImportResult(result);
        } catch (Exception e) {
            log.error("Failed to process sync result", e);
        }
    }
}
