package com.wheimo.api.domain.repository;

import com.wheimo.api.domain.entity.AccountException;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface AccountExceptionRepository extends JpaRepository<AccountException, Long> {
    List<AccountException> findByAccountId(Long accountId);
    Optional<AccountException> findByIdAndAccountId(Long id, Long accountId);
}
