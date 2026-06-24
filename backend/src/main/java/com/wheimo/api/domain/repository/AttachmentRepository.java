package com.wheimo.api.domain.repository;

import com.wheimo.api.domain.entity.Attachment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;

public interface AttachmentRepository extends JpaRepository<Attachment, Long> {
    @Query("SELECT a FROM Attachment a JOIN a.transaction t JOIN t.account ac WHERE a.id = :id AND ac.user.id = :userId")
    Optional<Attachment> findByIdAndUserId(@Param("id") Long id, @Param("userId") Long userId);
}
