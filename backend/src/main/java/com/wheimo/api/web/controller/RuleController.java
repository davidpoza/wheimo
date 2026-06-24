package com.wheimo.api.web.controller;

import com.wheimo.api.domain.dto.RuleDto;
import com.wheimo.api.domain.service.RuleService;
import com.wheimo.api.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/rules")
@RequiredArgsConstructor
public class RuleController {

    private final RuleService ruleService;

    @PostMapping
    public ResponseEntity<RuleDto> create(@RequestBody Map<String, String> body) {
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ruleService.create(SecurityUtils.getCurrentUserId(), body.get("name"), body.get("type"), body.get("value")));
    }

    @GetMapping
    public ResponseEntity<List<RuleDto>> list() {
        return ResponseEntity.ok(ruleService.findAll(SecurityUtils.getCurrentUserId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<RuleDto> get(@PathVariable Long id) {
        return ResponseEntity.ok(ruleService.findById(id, SecurityUtils.getCurrentUserId()));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<RuleDto> update(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(ruleService.updateById(id, SecurityUtils.getCurrentUserId(),
                body.get("name"), body.get("type"), body.get("value")));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        ruleService.deleteById(id, SecurityUtils.getCurrentUserId());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{ruleId}/tags")
    public ResponseEntity<RuleDto> addTag(@PathVariable Long ruleId, @RequestBody Map<String, Long> body) {
        return ResponseEntity.ok(ruleService.addTag(ruleId, body.get("tagId"), SecurityUtils.getCurrentUserId()));
    }

    @DeleteMapping("/{ruleId}/tags/{tagId}")
    public ResponseEntity<Void> removeTag(@PathVariable Long ruleId, @PathVariable Long tagId) {
        ruleService.removeTag(ruleId, tagId, SecurityUtils.getCurrentUserId());
        return ResponseEntity.noContent().build();
    }
}
