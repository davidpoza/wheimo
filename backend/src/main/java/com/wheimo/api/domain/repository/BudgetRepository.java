package com.wheimo.api.domain.repository;

import com.wheimo.api.domain.entity.Budget;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface BudgetRepository extends JpaRepository<Budget, Long> {
    @Query("SELECT b FROM Budget b JOIN FETCH b.tag t WHERE t.user.id = :userId")
    List<Budget> findByUserId(@Param("userId") Long userId);

    @Query("SELECT b FROM Budget b JOIN FETCH b.tag t WHERE b.id = :id AND t.user.id = :userId")
    Optional<Budget> findByIdAndUserId(@Param("id") Long id, @Param("userId") Long userId);
}
