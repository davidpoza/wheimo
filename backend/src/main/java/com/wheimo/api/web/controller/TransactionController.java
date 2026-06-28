package com.wheimo.api.web.controller;

import com.wheimo.api.domain.dto.*;
import com.wheimo.api.domain.service.TransactionService;
import com.wheimo.api.security.SecurityUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    @PostMapping
    public ResponseEntity<TransactionDto> create(@Valid @RequestBody CreateTransactionRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(
                transactionService.create(SecurityUtils.getCurrentUserId(), req));
    }

    @GetMapping
    public ResponseEntity<TransactionPageDto> list(
            @RequestParam(required = false) Long accountId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) OffsetDateTime from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) OffsetDateTime to,
            @RequestParam(required = false) String tags,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) BigDecimal min,
            @RequestParam(required = false) BigDecimal max,
            @RequestParam(required = false) String operationType,
            @RequestParam(required = false) Boolean isFav,
            @RequestParam(required = false) Boolean isDraft,
            @RequestParam(required = false) Boolean hasAttachments,
            @RequestParam(required = false) String ids,
            @RequestParam(required = false) Integer limit,
            @RequestParam(required = false) Integer offset,
            @RequestParam(required = false) String sort) {

        List<Long> tagList = tags != null
                ? Arrays.stream(tags.split(",")).map(Long::parseLong).toList()
                : null;
        List<Long> idList = ids != null
                ? Arrays.stream(ids.split(",")).map(Long::parseLong).toList()
                : null;

        TransactionFilterParams params = TransactionFilterParams.builder()
                .accountId(accountId).from(from).to(to).tags(tagList).search(search)
                .min(min).max(max).operationType(operationType).isFav(isFav).isDraft(isDraft)
                .hasAttachments(hasAttachments).ids(idList).limit(limit).offset(offset).sort(sort)
                .build();

        return ResponseEntity.ok(transactionService.findAll(SecurityUtils.getCurrentUserId(), params));
    }

    @GetMapping("/{id:\\d+}")
    public ResponseEntity<TransactionDto> get(@PathVariable Long id) {
        return ResponseEntity.ok(transactionService.findById(id, SecurityUtils.getCurrentUserId()));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<TransactionDto> update(@PathVariable Long id, @RequestBody UpdateTransactionRequest req) {
        return ResponseEntity.ok(transactionService.updateById(id, SecurityUtils.getCurrentUserId(), req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id,
                                       @RequestParam(required = false) String ids) {
        Long userId = SecurityUtils.getCurrentUserId();
        if (ids != null) {
            List<Long> idList = Arrays.stream(ids.split(",")).map(Long::parseLong).toList();
            transactionService.deleteByIds(idList, userId);
        } else {
            transactionService.deleteById(id, userId);
        }
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteByIds(@RequestParam String ids) {
        List<Long> idList = Arrays.stream(ids.split(",")).map(Long::parseLong).toList();
        transactionService.deleteByIds(idList, SecurityUtils.getCurrentUserId());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/apply-tags")
    public ResponseEntity<Void> applyTags(@PathVariable Long id) {
        transactionService.applyTagsToTransaction(id, SecurityUtils.getCurrentUserId());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/apply-specific-tags")
    public ResponseEntity<Map<Long, List<TagDto>>> applySpecificTags(@RequestBody Map<String, Object> body) {
        List<Long> ids = ((List<?>) body.get("ids")).stream().map(i -> ((Number) i).longValue()).toList();
        List<Long> tagIds = ((List<?>) body.get("tagIds")).stream().map(i -> ((Number) i).longValue()).toList();
        return ResponseEntity.ok(transactionService.applySpecificTags(ids, tagIds, SecurityUtils.getCurrentUserId()));
    }

    @GetMapping("/tags")
    public ResponseEntity<List<TagExpenseDto>> expensesByTags(
            @RequestParam(required = false) Long accountId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) OffsetDateTime from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) OffsetDateTime to) {
        return ResponseEntity.ok(transactionService.calculateExpensesByTags(SecurityUtils.getCurrentUserId(), accountId, from, to));
    }

    @GetMapping("/calendar")
    public ResponseEntity<Map<String, BigDecimal>> calendar(
            @RequestParam Long accountId,
            @RequestParam int year) {
        return ResponseEntity.ok(transactionService.calculateCalendar(SecurityUtils.getCurrentUserId(), accountId, year));
    }

    @GetMapping("/statistics")
    public ResponseEntity<StatisticsDto> statistics(
            @RequestParam Long accountId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) OffsetDateTime from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) OffsetDateTime to) {
        return ResponseEntity.ok(transactionService.calculateStatistics(SecurityUtils.getCurrentUserId(), accountId, from, to));
    }
}
