package com.wheimo.api.domain.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;

@Entity
@Table(name = "recurrents")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Recurrent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Builder.Default
    private BigDecimal amount = BigDecimal.ZERO;

    private BigDecimal units;

    @Column(nullable = false)
    private String establishment;

    private Integer periodicity;

    @Column(name = "periodicity_type", nullable = false)
    @Builder.Default
    private String periodicityType = "DAYS";

    @Column(name = "periodicity_month")
    private Integer periodicityMonth;

    @Column(name = "start_date")
    private LocalDate startDate;

    private String link;

    @Column(name = "created_at")
    private OffsetDateTime createdAt;

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;

    @PrePersist
    void prePersist() {
        createdAt = OffsetDateTime.now();
    }

    @PreUpdate
    void preUpdate() {
        updatedAt = OffsetDateTime.now();
    }
}
