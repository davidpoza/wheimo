package com.wheimo.api.domain.repository;

import com.wheimo.api.domain.entity.PriceTracker;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PriceTrackerRepository extends JpaRepository<PriceTracker, Long> {
    List<PriceTracker> findAllByActiveTrue();
    List<PriceTracker> findAllByOrderByNameAsc();
    boolean existsByName(String name);
    boolean existsByNameAndIdNot(String name, Long id);
}
