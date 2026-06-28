package com.wheimo.api.domain.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Entity
@Table(name = "recurrent_transaction_links")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class RecurrentTransactionLink {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "recurrent_id", nullable = false)
    private Recurrent recurrent;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "transaction_id", nullable = false)
    private Transaction transaction;

    @Column(name = "amount_snapshot", nullable = false, precision = 19, scale = 4)
    private BigDecimal amountSnapshot;

    @Column(name = "units_snapshot", precision = 19, scale = 4)
    private BigDecimal unitsSnapshot;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;

    @PrePersist
    void prePersist() {
        if (createdAt == null) createdAt = OffsetDateTime.now();
    }
}
