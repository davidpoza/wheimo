package com.wheimo.api.domain.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Entity
@Table(name = "recurrent_price_entries")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class RecurrentPriceEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "recurrent_id", nullable = false)
    private Recurrent recurrent;

    @Column(nullable = false)
    private BigDecimal amount;

    @Column(name = "recorded_at", nullable = false)
    private OffsetDateTime recordedAt;

    @PrePersist
    void prePersist() {
        if (recordedAt == null) {
            recordedAt = OffsetDateTime.now();
        }
    }
}
