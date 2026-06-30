package com.wheimo.api.domain.service;

import com.wheimo.api.domain.dto.*;
import com.wheimo.api.domain.entity.PriceReading;
import com.wheimo.api.domain.entity.PriceTracker;
import com.wheimo.api.domain.fetcher.PriceFetcherRegistry;
import com.wheimo.api.domain.repository.PriceReadingRepository;
import com.wheimo.api.domain.repository.PriceTrackerRepository;
import com.wheimo.api.web.exception.ConflictException;
import com.wheimo.api.web.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PriceTrackerService {

    private final PriceTrackerRepository trackerRepository;
    private final PriceReadingRepository readingRepository;
    private final PriceFetcherRegistry fetcherRegistry;

    @Transactional
    public PriceTrackerDto create(CreatePriceTrackerRequest request) {
        validateFetcherType(request.fetcherType());
        if (trackerRepository.existsByName(request.name())) {
            throw new ConflictException("Price tracker name already exists");
        }
        PriceTracker tracker = PriceTracker.builder()
                .name(request.name())
                .fetcherType(request.fetcherType())
                .params(copyParams(request.params()))
                .active(true)
                .build();
        return toDto(trackerRepository.save(tracker));
    }

    public List<PriceTrackerDto> findAll() {
        return trackerRepository.findAllByOrderByNameAsc().stream().map(this::toDto).toList();
    }

    public List<PriceTracker> findAllActiveEntities() {
        return trackerRepository.findAllByActiveTrue();
    }

    public PriceTracker findEntityById(Long id) {
        return trackerRepository.findById(id).orElseThrow(() -> new NotFoundException("Price tracker not found"));
    }

    public PriceTrackerDto findById(Long id) {
        return toDto(findEntityById(id));
    }

    @Transactional
    public PriceTrackerDto update(Long id, UpdatePriceTrackerRequest request) {
        PriceTracker tracker = findEntityById(id);
        if (request.name() != null && !request.name().equals(tracker.getName())) {
            if (trackerRepository.existsByNameAndIdNot(request.name(), id)) {
                throw new ConflictException("Price tracker name already exists");
            }
            tracker.setName(request.name());
        }
        if (request.fetcherType() != null) {
            validateFetcherType(request.fetcherType());
            tracker.setFetcherType(request.fetcherType());
        }
        if (request.params() != null) {
            tracker.setParams(copyParams(request.params()));
        }
        if (request.active() != null) {
            tracker.setActive(request.active());
        }
        return toDto(trackerRepository.save(tracker));
    }

    @Transactional
    public void delete(Long id) {
        PriceTracker tracker = findEntityById(id);
        trackerRepository.delete(tracker);
    }

    public List<PriceReadingDto> getReadings(Long id, LocalDate from, LocalDate to) {
        if (!trackerRepository.existsById(id)) {
            throw new NotFoundException("Price tracker not found");
        }
        List<PriceReading> readings = from != null || to != null
                ? readingRepository.findByTrackerIdAndReadingDateBetweenOrderByReadingDateAscLocationKeyAsc(
                        id,
                        from != null ? from : LocalDate.of(1970, 1, 1),
                        to != null ? to : LocalDate.now().plusYears(100))
                : readingRepository.findByTrackerIdOrderByReadingDateAscLocationKeyAsc(id);
        return readings.stream().map(this::toDto).toList();
    }

    @Transactional
    public int saveReadings(List<PriceReading> readings) {
        int inserted = 0;
        for (PriceReading reading : readings) {
            Long trackerId = reading.getTracker().getId();
            if (!readingRepository.existsByTrackerIdAndReadingDateAndLocationKey(
                    trackerId, reading.getReadingDate(), reading.getLocationKey())) {
                readingRepository.save(reading);
                inserted++;
            }
        }
        return inserted;
    }

    public List<FetcherTypeDto> getFetcherTypes() {
        return fetcherRegistry.findAll().stream()
                .map(fetcher -> FetcherTypeDto.builder()
                        .type(fetcher.getType())
                        .label(labelFor(fetcher.getType()))
                        .paramSchema(fetcher.getParamSchema())
                        .build())
                .toList();
    }

    private void validateFetcherType(String fetcherType) {
        if (fetcherRegistry.findByType(fetcherType).isEmpty()) {
            throw new IllegalArgumentException("Unknown price fetcher type: " + fetcherType);
        }
    }

    private Map<String, Object> copyParams(Map<String, Object> params) {
        return params != null ? new LinkedHashMap<>(params) : new LinkedHashMap<>();
    }

    private String labelFor(String fetcherType) {
        return "GASOIL".equals(fetcherType) ? "Gasoil (MINETUR)" : fetcherType;
    }

    private PriceTrackerDto toDto(PriceTracker tracker) {
        return PriceTrackerDto.builder()
                .id(tracker.getId())
                .name(tracker.getName())
                .fetcherType(tracker.getFetcherType())
                .params(tracker.getParams())
                .active(tracker.isActive())
                .createdAt(tracker.getCreatedAt())
                .build();
    }

    private PriceReadingDto toDto(PriceReading reading) {
        return PriceReadingDto.builder()
                .id(reading.getId())
                .readingDate(reading.getReadingDate())
                .locationKey(reading.getLocationKey())
                .value(reading.getValue())
                .build();
    }
}
