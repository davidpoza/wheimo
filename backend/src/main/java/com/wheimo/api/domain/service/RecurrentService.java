package com.wheimo.api.domain.service;

import com.wheimo.api.domain.dto.RecurrentDto;
import com.wheimo.api.domain.entity.Recurrent;
import com.wheimo.api.domain.entity.Transaction;
import com.wheimo.api.domain.repository.RecurrentRepository;
import com.wheimo.api.domain.repository.TransactionRepository;
import com.wheimo.api.web.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class RecurrentService {

    private final RecurrentRepository recurrentRepository;
    private final TransactionRepository transactionRepository;

    public RecurrentDto create(String name, BigDecimal amount, String emitter, Long transactionId) {
        Transaction transaction = transactionId != null
                ? transactionRepository.findById(transactionId).orElse(null)
                : null;
        Recurrent r = Recurrent.builder().name(name).amount(amount).emitter(emitter).transaction(transaction).build();
        return toDto(recurrentRepository.save(r));
    }

    public List<RecurrentDto> findAll() {
        return recurrentRepository.findAll().stream().map(this::toDto).toList();
    }

    public RecurrentDto updateById(Long id, Map<String, Object> updates) {
        Recurrent r = recurrentRepository.findById(id).orElseThrow(() -> new NotFoundException("Recurrent not found"));
        if (updates.containsKey("name")) r.setName((String) updates.get("name"));
        if (updates.containsKey("amount")) r.setAmount(new BigDecimal(updates.get("amount").toString()));
        if (updates.containsKey("emitter")) r.setEmitter((String) updates.get("emitter"));
        return toDto(recurrentRepository.save(r));
    }

    public void deleteById(Long id) {
        Recurrent r = recurrentRepository.findById(id).orElseThrow(() -> new NotFoundException("Recurrent not found"));
        recurrentRepository.delete(r);
    }

    private RecurrentDto toDto(Recurrent r) {
        return RecurrentDto.builder()
                .id(r.getId()).name(r.getName()).amount(r.getAmount()).emitter(r.getEmitter())
                .transactionId(r.getTransaction() != null ? r.getTransaction().getId() : null)
                .createdAt(r.getCreatedAt()).updatedAt(r.getUpdatedAt()).build();
    }
}
