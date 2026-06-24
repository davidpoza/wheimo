package com.wheimo.api.domain.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    private String name;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Builder.Default
    private boolean active = false;

    @Builder.Default
    @Column(length = 2)
    private String lang = "en";

    @Builder.Default
    @Column(length = 10)
    private String theme = "light";

    @Builder.Default
    @Column(length = 10)
    private String level = "user";

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ignored_tag_id")
    private Tag ignoredTag;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Account> accounts = new ArrayList<>();

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
