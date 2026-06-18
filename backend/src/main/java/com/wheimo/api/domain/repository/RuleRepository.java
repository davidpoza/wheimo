package com.wheimo.api.domain.repository;

import com.wheimo.api.domain.entity.Rule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface RuleRepository extends JpaRepository<Rule, Long> {
    @Query("SELECT r FROM Rule r LEFT JOIN FETCH r.tags WHERE r.user.id = :userId")
    List<Rule> findByUserIdWithTags(@Param("userId") Long userId);

    Optional<Rule> findByIdAndUserId(Long id, Long userId);
    boolean existsByNameAndUserId(String name, Long userId);
}
