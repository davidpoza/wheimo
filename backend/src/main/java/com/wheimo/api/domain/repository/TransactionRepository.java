package com.wheimo.api.domain.repository;

import com.wheimo.api.domain.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

public interface TransactionRepository extends JpaRepository<Transaction, Long>, JpaSpecificationExecutor<Transaction> {
    boolean existsByImportId(String importId);
    Optional<Transaction> findByIdAndAccountUserId(Long id, Long userId);

    @Query("SELECT t FROM Transaction t JOIN t.account a WHERE a.userId = :userId AND t.id IN :ids")
    List<Transaction> findAllByIdsAndUserId(@Param("ids") List<Long> ids, @Param("userId") Long userId);

    @Query("""
        SELECT t FROM Transaction t
        JOIN FETCH t.account a
        LEFT JOIN FETCH t.tags
        LEFT JOIN FETCH t.attachments
        WHERE a.userId = :userId AND t.id = :id
        """)
    Optional<Transaction> findByIdWithDetails(@Param("id") Long id, @Param("userId") Long userId);

    @Query("""
        SELECT t FROM Transaction t JOIN t.account a
        WHERE a.id = :accountId AND a.userId = :userId
        ORDER BY t.date DESC
        """)
    List<Transaction> findByAccountIdAndUserId(@Param("accountId") Long accountId, @Param("userId") Long userId);

    @Query("""
        SELECT SUM(t.amount) FROM Transaction t
        JOIN t.tags tag
        WHERE tag.id = :tagId AND t.date BETWEEN :from AND :to AND t.amount < 0
        """)
    Optional<BigDecimal> sumAmountByTagAndDateRange(
        @Param("tagId") Long tagId,
        @Param("from") OffsetDateTime from,
        @Param("to") OffsetDateTime to
    );
}
