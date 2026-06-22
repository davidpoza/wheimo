package com.wheimo.api.domain.repository;

import com.wheimo.api.domain.entity.RecurrentTransactionLink;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface RecurrentTransactionLinkRepository extends JpaRepository<RecurrentTransactionLink, Long> {

    @Query("SELECT l FROM RecurrentTransactionLink l JOIN FETCH l.transaction t WHERE l.recurrent.id = :recurrentId ORDER BY t.date DESC")
    List<RecurrentTransactionLink> findByRecurrentIdOrderByTransactionDateDesc(@Param("recurrentId") Long recurrentId);

    List<RecurrentTransactionLink> findByTransactionId(Long transactionId);

    Optional<RecurrentTransactionLink> findByRecurrentIdAndTransactionId(Long recurrentId, Long transactionId);

    boolean existsByRecurrentIdAndTransactionId(Long recurrentId, Long transactionId);
}
