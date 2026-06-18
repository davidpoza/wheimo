package com.wheimo.api.domain.repository;

import com.wheimo.api.domain.entity.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface TagRepository extends JpaRepository<Tag, Long> {
    List<Tag> findByUserId(Long userId);
    Optional<Tag> findByIdAndUserId(Long id, Long userId);
}
