package com.wheimo.api.domain.repository;

import com.wheimo.api.domain.entity.RecurrentPriceEntry;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RecurrentPriceEntryRepository extends JpaRepository<RecurrentPriceEntry, Long> {
    List<RecurrentPriceEntry> findByRecurrentIdOrderByRecordedAtDesc(Long recurrentId);
}
