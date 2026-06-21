package com.wheimo.api.domain.service;

import com.wheimo.api.domain.dto.ImportResultDto;
import com.wheimo.api.domain.dto.SyncResultMessage;
import com.wheimo.api.domain.repository.AccountRepository;
import com.wheimo.api.web.exception.ForbiddenException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class XlsImportService {

    private final FetcherClient fetcherClient;
    private final TransactionService transactionService;
    private final AccountRepository accountRepository;

    public ImportResultDto importXls(MultipartFile file, Long accountId, Long userId) throws Exception {
        accountRepository.findByIdAndUserId(accountId, userId)
                .orElseThrow(() -> new ForbiddenException("Account does not belong to user"));

        List<SyncResultMessage.ImportedTransaction> transactions = fetcherClient.parseXls(file, accountId, userId);

        SyncResultMessage msg = new SyncResultMessage();
        msg.setAccountId(accountId);
        msg.setUserId(userId);
        msg.setTransactions(transactions);

        int imported = transactionService.processImportResult(msg);
        int skipped = transactions.size() - imported;
        log.info("XLS import for account {}: {} imported, {} skipped", accountId, imported, skipped);
        return new ImportResultDto(imported, skipped);
    }
}
