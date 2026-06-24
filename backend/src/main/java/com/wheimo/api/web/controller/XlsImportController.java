package com.wheimo.api.web.controller;

import com.wheimo.api.domain.dto.ImportResultDto;
import com.wheimo.api.domain.service.XlsImportService;
import com.wheimo.api.security.SecurityUtils;
import com.wheimo.api.web.exception.ForbiddenException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import static org.springframework.http.HttpStatus.UNPROCESSABLE_ENTITY;

@RestController
@RequestMapping("/accounts/{accountId}/import")
@RequiredArgsConstructor
@Slf4j
public class XlsImportController {

    private final XlsImportService xlsImportService;

    @PostMapping("/xls")
    public ResponseEntity<ImportResultDto> importXls(
            @PathVariable Long accountId,
            @RequestParam("file") MultipartFile file) {
        Long userId = SecurityUtils.getCurrentUserId();
        try {
            return ResponseEntity.ok(xlsImportService.importXls(file, accountId, userId));
        } catch (ForbiddenException e) {
            throw e;
        } catch (Exception e) {
            log.error("XLS import failed for account {}", accountId, e);
            throw new ResponseStatusException(UNPROCESSABLE_ENTITY, e.getMessage());
        }
    }
}
