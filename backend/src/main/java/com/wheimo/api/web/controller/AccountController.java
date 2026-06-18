package com.wheimo.api.web.controller;

import com.wheimo.api.domain.dto.*;
import com.wheimo.api.domain.service.AccountService;
import com.wheimo.api.security.SecurityUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/accounts")
@RequiredArgsConstructor
public class AccountController {

    private final AccountService accountService;

    @PostMapping
    public ResponseEntity<AccountDto> create(@Valid @RequestBody CreateAccountRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(accountService.create(SecurityUtils.getCurrentUserId(), req));
    }

    @GetMapping
    public ResponseEntity<List<AccountDto>> list() {
        return ResponseEntity.ok(accountService.findAll(SecurityUtils.getCurrentUserId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AccountDto> get(@PathVariable Long id) {
        return ResponseEntity.ok(accountService.findById(id, SecurityUtils.getCurrentUserId()));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<AccountDto> update(@PathVariable Long id, @RequestBody UpdateAccountRequest req) {
        return ResponseEntity.ok(accountService.updateById(id, SecurityUtils.getCurrentUserId(), req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        accountService.deleteById(id, SecurityUtils.getCurrentUserId());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/resync")
    public ResponseEntity<Void> resync(@PathVariable Long id, @Valid @RequestBody ResyncRequest req) {
        accountService.triggerResync(id, SecurityUtils.getCurrentUserId(), req.getFrom());
        return ResponseEntity.accepted().build();
    }

    @PostMapping("/fix-balances")
    public ResponseEntity<Void> fixBalances(@Valid @RequestBody FixBalancesRequest req) {
        accountService.fixBalances(req.getAccountId(), SecurityUtils.getCurrentUserId(),
                req.getFromTransactionId(), req.getInitialBalance(), req.isOnlyRegenerateImportId());
        return ResponseEntity.noContent().build();
    }
}
