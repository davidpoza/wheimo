package com.wheimo.api.web.controller;

import com.wheimo.api.domain.dto.RecurrentDto;
import com.wheimo.api.domain.dto.RecurrentLinkDto;
import com.wheimo.api.domain.dto.RecurrentPriceEntryDto;
import com.wheimo.api.domain.service.RecurrentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/recurrents")
@RequiredArgsConstructor
public class RecurrentController {

    private final RecurrentService recurrentService;

    @PostMapping
    public ResponseEntity<RecurrentDto> create(@RequestBody Map<String, Object> body) {
        String name = (String) body.get("name");
        String establishment = (String) body.get("establishment");
        BigDecimal amount = body.get("amount") != null ? new BigDecimal(body.get("amount").toString()) : null;
        Integer periodicity = body.get("periodicity") != null ? ((Number) body.get("periodicity")).intValue() : null;
        String periodicityType = (String) body.get("periodicityType");
        Integer periodicityMonth = body.get("periodicityMonth") != null ? ((Number) body.get("periodicityMonth")).intValue() : null;
        String link = (String) body.get("link");
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(recurrentService.create(name, establishment, amount, periodicity, periodicityType, periodicityMonth, link));
    }

    @GetMapping
    public ResponseEntity<List<RecurrentDto>> list() {
        return ResponseEntity.ok(recurrentService.findAll());
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<RecurrentDto>> upcoming() {
        return ResponseEntity.ok(recurrentService.findUpcoming());
    }

    @PatchMapping("/{id}")
    public ResponseEntity<RecurrentDto> update(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        return ResponseEntity.ok(recurrentService.updateById(id, body));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        recurrentService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/prices")
    public ResponseEntity<RecurrentPriceEntryDto> addPrice(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        BigDecimal amount = new BigDecimal(body.get("amount").toString());
        OffsetDateTime recordedAt = body.get("recordedAt") != null
                ? OffsetDateTime.parse((String) body.get("recordedAt"))
                : null;
        return ResponseEntity.status(HttpStatus.CREATED).body(recurrentService.addPriceEntry(id, amount, recordedAt));
    }

    @GetMapping("/{id}/prices")
    public ResponseEntity<List<RecurrentPriceEntryDto>> getPrices(@PathVariable Long id) {
        return ResponseEntity.ok(recurrentService.getPriceHistory(id));
    }

    @PostMapping("/{id}/transactions/{transactionId}")
    public ResponseEntity<RecurrentLinkDto> assignTransaction(@PathVariable Long id, @PathVariable Long transactionId) {
        return ResponseEntity.status(HttpStatus.CREATED).body(recurrentService.assignTransaction(id, transactionId));
    }

    @DeleteMapping("/{id}/transactions/{transactionId}")
    public ResponseEntity<Void> unassignTransaction(@PathVariable Long id, @PathVariable Long transactionId) {
        recurrentService.unassignTransaction(id, transactionId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/transactions")
    public ResponseEntity<List<RecurrentLinkDto>> getLinkedTransactions(@PathVariable Long id) {
        return ResponseEntity.ok(recurrentService.getLinkedTransactions(id));
    }
}
