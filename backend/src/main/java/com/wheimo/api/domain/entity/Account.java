package com.wheimo.api.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Entity
@Table(name = "accounts")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String number;

    @Column(nullable = false)
    private String name;

    private String description;

    @Builder.Default
    private BigDecimal balance = BigDecimal.ZERO;

    @Column(name = "bank_id", nullable = false, length = 20)
    private String bankId;

    @Column(name = "access_id")
    private String accessId;

    @Column(name = "access_password")
    private String accessPassword;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private Map<String, String> settings;

    @Column(name = "saving_target_amount")
    private BigDecimal savingTargetAmount;

    @Column(name = "saving_initial_amount")
    private BigDecimal savingInitialAmount;

    @Column(name = "saving_amount_func")
    private String savingAmountFunc;

    @Column(name = "saving_frequency")
    private String savingFrequency;

    @Column(name = "saving_init_date")
    private OffsetDateTime savingInitDate;

    @Column(name = "saving_target_date")
    private OffsetDateTime savingTargetDate;

    @Column(name = "last_sync_count")
    @Builder.Default
    private Integer lastSyncCount = 0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "account", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Transaction> transactions = new ArrayList<>();

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
