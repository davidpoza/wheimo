package com.wheimo.api.web.controller;

import com.wheimo.api.domain.dto.*;
import com.wheimo.api.domain.service.PriceFetchScheduler;
import com.wheimo.api.domain.service.PriceTrackerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/price-trackers")
@RequiredArgsConstructor
public class PriceTrackerController {

    private final PriceTrackerService trackerService;
    private final PriceFetchScheduler fetchScheduler;

    @GetMapping
    public ResponseEntity<List<PriceTrackerDto>> list() {
        return ResponseEntity.ok(trackerService.findAll());
    }

    @PostMapping
    public ResponseEntity<PriceTrackerDto> create(@Valid @RequestBody CreatePriceTrackerRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(trackerService.create(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PriceTrackerDto> get(@PathVariable Long id) {
        return ResponseEntity.ok(trackerService.findById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PriceTrackerDto> update(@PathVariable Long id, @RequestBody UpdatePriceTrackerRequest request) {
        return ResponseEntity.ok(trackerService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        trackerService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/readings")
    public ResponseEntity<List<PriceReadingDto>> readings(
            @PathVariable Long id,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return ResponseEntity.ok(trackerService.getReadings(id, from, to));
    }

    @PostMapping("/fetch")
    public ResponseEntity<FetchResultDto> fetchAll() {
        return ResponseEntity.ok(fetchScheduler.fetchAll());
    }

    @PostMapping("/{id}/fetch")
    public ResponseEntity<FetchResultDto> fetchOne(@PathVariable Long id) {
        return ResponseEntity.ok(fetchScheduler.fetchOne(id));
    }

    @GetMapping("/fetcher-types")
    public ResponseEntity<List<FetcherTypeDto>> fetcherTypes() {
        return ResponseEntity.ok(trackerService.getFetcherTypes());
    }
}
