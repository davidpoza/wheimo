package com.wheimo.fetcher.web;

import com.wheimo.fetcher.dto.SyncResultMessage;
import com.wheimo.fetcher.importer.OpenbankXlsImporter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/import")
@RequiredArgsConstructor
@Slf4j
public class XlsImportController {

    private final OpenbankXlsImporter xlsImporter;

    @PostMapping("/xls")
    public ResponseEntity<List<SyncResultMessage.ImportedTransaction>> importXls(
            @RequestParam("file") MultipartFile file,
            @RequestParam("accountId") Long accountId,
            @RequestParam("userId") Long userId) {
        try {
            List<SyncResultMessage.ImportedTransaction> transactions = xlsImporter.parse(file, accountId);
            log.info("Parsed {} transactions from XLS for account {}", transactions.size(), accountId);
            return ResponseEntity.ok(transactions);
        } catch (Exception e) {
            log.error("XLS parse failed for account {}", accountId, e);
            return ResponseEntity.unprocessableEntity().build();
        }
    }
}
