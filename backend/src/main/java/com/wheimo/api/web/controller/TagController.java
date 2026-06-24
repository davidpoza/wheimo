package com.wheimo.api.web.controller;

import com.wheimo.api.domain.dto.TagDto;
import com.wheimo.api.domain.service.TagService;
import com.wheimo.api.security.SecurityUtils;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/tags")
@RequiredArgsConstructor
public class TagController {

    private final TagService tagService;

    @PostMapping
    public ResponseEntity<TagDto> create(@RequestBody Map<String, String> body) {
        String name = body.get("name");
        if (name == null || name.isBlank()) return ResponseEntity.badRequest().build();
        return ResponseEntity.status(HttpStatus.CREATED).body(tagService.create(SecurityUtils.getCurrentUserId(), name));
    }

    @GetMapping
    public ResponseEntity<List<TagDto>> list() {
        return ResponseEntity.ok(tagService.findAll(SecurityUtils.getCurrentUserId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TagDto> get(@PathVariable Long id) {
        return ResponseEntity.ok(tagService.findById(id, SecurityUtils.getCurrentUserId()));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<TagDto> update(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(tagService.updateById(id, SecurityUtils.getCurrentUserId(), body.get("name")));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        tagService.deleteById(id, SecurityUtils.getCurrentUserId());
        return ResponseEntity.noContent().build();
    }
}
