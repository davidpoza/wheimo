package com.wheimo.api.domain.repository;

import com.wheimo.api.domain.entity.Recurrent;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RecurrentRepository extends JpaRepository<Recurrent, Long> {
    List<Recurrent> findAll();
}
