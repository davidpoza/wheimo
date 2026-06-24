package com.wheimo.fetcher.service;

import com.wheimo.fetcher.dto.SyncRequestMessage;
import com.wheimo.fetcher.dto.SyncResultMessage;
import com.wheimo.fetcher.importer.BankImporter;
import com.wheimo.fetcher.importer.NordigenImporter;
import com.wheimo.fetcher.importer.OpenbankImporter;
import com.wheimo.fetcher.importer.OpenbankPrepaidImporter;
import com.wheimo.fetcher.messaging.RedisPublisher;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class ImportService {

    private final NordigenImporter nordigenImporter;
    private final OpenbankImporter openbankImporter;
    private final OpenbankPrepaidImporter openbankPrepaidImporter;
    private final EncryptionService encryptionService;
    private final RedisPublisher redisPublisher;

    public void process(SyncRequestMessage request) {
        log.info("Processing sync request for account {} (bankId={})", request.getAccountId(), request.getBankId());

        BankImporter importer = selectImporter(request.getBankId());
        if (importer == null) {
            SyncResultMessage error = SyncResultMessage.builder()
                    .accountId(request.getAccountId())
                    .userId(request.getUserId())
                    .error("Unsupported bankId: " + request.getBankId())
                    .build();
            redisPublisher.publishResult(error);
            return;
        }

        String decryptedPassword = encryptionService.decrypt(request.getEncryptedPassword());
        SyncResultMessage result = importer.fetchTransactions(request, decryptedPassword);
        redisPublisher.publishResult(result);
    }

    private BankImporter selectImporter(String bankId) {
        return switch (bankId) {
            case "nordigen" -> nordigenImporter;
            case "opbk" -> openbankImporter;
            case "opbkprepaid" -> openbankPrepaidImporter;
            default -> null;
        };
    }
}
