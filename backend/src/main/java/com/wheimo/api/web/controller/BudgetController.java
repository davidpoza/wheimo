package com.wheimo.api.web.controller;

import com.wheimo.api.domain.dto.BudgetDto;
import com.wheimo.api.domain.service.BudgetService;
import com.wheimo.api.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/budgets")
@RequiredArgsConstructor
public class BudgetController {

    private final BudgetService budgetService;

    @PostMapping
    public ResponseEntity<BudgetDto> create(@RequestBody Map<String, Object> body) {
        Long tagId = ((Number) body.get("tagId")).longValue();
        BigDecimal value = new BigDecimal(body.get("value").toString());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(budgetService.create(SecurityUtils.getCurrentUserId(), tagId, value));
    }

    @GetMapping
    public ResponseEntity<List<BudgetDto>> list() {
        return ResponseEntity.ok(budgetService.findAll(SecurityUtils.getCurrentUserId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BudgetDto> get(@PathVariable Long id) {
        return ResponseEntity.ok(budgetService.findById(id, SecurityUtils.getCurrentUserId()));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<BudgetDto> update(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        BigDecimal value = body.get("value") != null ? new BigDecimal(body.get("value").toString()) : null;
        return ResponseEntity.ok(budgetService.updateById(id, SecurityUtils.getCurrentUserId(), value));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        budgetService.deleteById(id, SecurityUtils.getCurrentUserId());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/status")
    public ResponseEntity<Map<String, Object>> status(@PathVariable Long id) {
        return ResponseEntity.ok(budgetService.getStatus(id, SecurityUtils.getCurrentUserId()));
    }
}
