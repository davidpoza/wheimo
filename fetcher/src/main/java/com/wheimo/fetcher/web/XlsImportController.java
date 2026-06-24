package com.wheimo.fetcher.web;

import com.wheimo.fetcher.dto.SyncResultMessage;
import com.wheimo.fetcher.importer.OpenbankXlsImporter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/import")
@RequiredArgsConstructor
@Slf4j
public class XlsImportController {

    private final OpenbankXlsImporter xlsImporter;

    @PostMapping("/xls")
    public ResponseEntity<SyncResultMessage> importXls(
            @RequestParam("file") MultipartFile file,
            @RequestParam("accountId") Long accountId,
            @RequestParam("userId") Long userId) {
        try {
            SyncResultMessage result = xlsImporter.parse(file, accountId);
            log.info("Parsed {} transactions from XLS for account {}, balance={}", result.getTransactions().size(), accountId, result.getBalance());
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("XLS parse failed for account {}", accountId, e);
            return ResponseEntity.unprocessableEntity().build();
        }
    }
}
