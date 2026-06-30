package com.wheimo.api.domain.repository;

import com.wheimo.api.domain.entity.PriceReading;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface PriceReadingRepository extends JpaRepository<PriceReading, Long> {
    List<PriceReading> findByTrackerIdAndReadingDateBetweenOrderByReadingDateAscLocationKeyAsc(
            Long trackerId, LocalDate from, LocalDate to);
    List<PriceReading> findByTrackerIdOrderByReadingDateAscLocationKeyAsc(Long trackerId);
    boolean existsByTrackerIdAndReadingDateAndLocationKey(Long trackerId, LocalDate readingDate, String locationKey);
}
