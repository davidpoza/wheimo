package com.wheimo.api.web.controller;

import com.wheimo.api.domain.dto.RecurrentDto;
import com.wheimo.api.domain.service.RecurrentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
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
        BigDecimal amount = body.get("amount") != null ? new BigDecimal(body.get("amount").toString()) : BigDecimal.ZERO;
        String emitter = (String) body.get("emitter");
        Long transactionId = body.get("transactionId") != null ? ((Number) body.get("transactionId")).longValue() : null;
        return ResponseEntity.status(HttpStatus.CREATED).body(recurrentService.create(name, amount, emitter, transactionId));
    }

    @GetMapping
    public ResponseEntity<List<RecurrentDto>> list() {
        return ResponseEntity.ok(recurrentService.findAll());
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
}
