package com.wheimo.api.web.controller;

import com.wheimo.api.domain.dto.AccountExceptionDto;
import com.wheimo.api.domain.service.AccountExceptionService;
import com.wheimo.api.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/accounts/{accountId}/exceptions")
@RequiredArgsConstructor
public class AccountExceptionController {

    private final AccountExceptionService exceptionService;

    @GetMapping
    public ResponseEntity<List<AccountExceptionDto>> list(@PathVariable Long accountId) {
        return ResponseEntity.ok(exceptionService.findAll(accountId, SecurityUtils.getCurrentUserId()));
    }

    @PostMapping
    public ResponseEntity<AccountExceptionDto> create(@PathVariable Long accountId, @RequestBody Map<String, String> body) {
        return ResponseEntity.status(HttpStatus.CREATED).body(
                exceptionService.create(accountId, SecurityUtils.getCurrentUserId(),
                        body.get("regex"), body.get("description")));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<AccountExceptionDto> update(@PathVariable Long accountId, @PathVariable Long id,
                                                      @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(exceptionService.update(id, accountId, SecurityUtils.getCurrentUserId(),
                body.get("regex"), body.get("description")));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long accountId, @PathVariable Long id) {
        exceptionService.delete(id, accountId, SecurityUtils.getCurrentUserId());
        return ResponseEntity.noContent().build();
    }
}
