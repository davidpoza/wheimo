package com.wheimo.api.domain.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "price_readings",
        uniqueConstraints = @UniqueConstraint(name = "uq_price_readings_tracker_date_location",
                columnNames = {"tracker_id", "reading_date", "location_key"}))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PriceReading {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "tracker_id", nullable = false)
    private PriceTracker tracker;

    @Column(name = "reading_date", nullable = false)
    private LocalDate readingDate;

    @Column(name = "location_key", nullable = false)
    private String locationKey;

    @Column(nullable = false, precision = 15, scale = 4)
    private BigDecimal value;
}
