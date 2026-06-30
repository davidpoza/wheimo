package com.wheimo.api.domain.service;

import com.wheimo.api.domain.dto.FetchResultDto;
import com.wheimo.api.domain.entity.PriceReading;
import com.wheimo.api.domain.entity.PriceTracker;
import com.wheimo.api.domain.fetcher.PriceFetcher;
import com.wheimo.api.domain.fetcher.PriceFetcherRegistry;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class PriceFetchScheduler {

    private final PriceTrackerService trackerService;
    private final PriceFetcherRegistry fetcherRegistry;

    @Scheduled(cron = "0 0 7 * * *")
    public void scheduledFetch() {
        fetchAll();
    }

    public FetchResultDto fetchAll() {
        List<PriceTracker> trackers = trackerService.findAllActiveEntities();
        List<FetchResultDto> results = trackers.stream().map(this::fetchTracker).toList();
        return FetchResultDto.builder()
                .status("ok")
                .triggered(trackers.size())
                .results(results)
                .build();
    }

    public FetchResultDto fetchOne(Long trackerId) {
        return fetchTracker(trackerService.findEntityById(trackerId));
    }

    private FetchResultDto fetchTracker(PriceTracker tracker) {
        try {
            PriceFetcher fetcher = fetcherRegistry.findByType(tracker.getFetcherType())
                    .orElseThrow(() -> new IllegalArgumentException("No price fetcher for type: " + tracker.getFetcherType()));
            List<PriceReading> readings = fetcher.fetch(tracker);
            int inserted = trackerService.saveReadings(readings);
            return FetchResultDto.builder()
                    .trackerId(tracker.getId())
                    .status("ok")
                    .newReadings(inserted)
                    .build();
        } catch (Exception ex) {
            log.error("Price fetch failed for tracker id={} name={}", tracker.getId(), tracker.getName(), ex);
            return FetchResultDto.builder()
                    .trackerId(tracker.getId())
                    .status("error")
                    .newReadings(0)
                    .message(ex.getMessage())
                    .build();
        }
    }
}
