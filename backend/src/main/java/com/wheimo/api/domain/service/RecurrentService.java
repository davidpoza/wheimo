package com.wheimo.api.domain.service;

import com.wheimo.api.domain.dto.RecurrentDto;
import com.wheimo.api.domain.dto.RecurrentLinkDto;
import com.wheimo.api.domain.dto.RecurrentPriceEntryDto;
import com.wheimo.api.domain.entity.Recurrent;
import com.wheimo.api.domain.entity.RecurrentPriceEntry;
import com.wheimo.api.domain.entity.RecurrentTransactionLink;
import com.wheimo.api.domain.entity.Transaction;
import com.wheimo.api.domain.repository.RecurrentPriceEntryRepository;
import com.wheimo.api.domain.repository.RecurrentRepository;
import com.wheimo.api.domain.repository.RecurrentTransactionLinkRepository;
import com.wheimo.api.domain.repository.TransactionRepository;
import com.wheimo.api.web.exception.ConflictException;
import com.wheimo.api.web.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class RecurrentService {

    private final RecurrentRepository recurrentRepository;
    private final RecurrentPriceEntryRepository priceEntryRepository;
    private final RecurrentTransactionLinkRepository linkRepository;
    private final TransactionRepository transactionRepository;

    public RecurrentDto create(String name, String establishment, BigDecimal amount, Integer periodicity, String link) {
        Recurrent r = Recurrent.builder()
                .name(name)
                .establishment(establishment)
                .amount(amount != null ? amount : BigDecimal.ZERO)
                .periodicity(periodicity)
                .link(link)
                .build();
        return toDto(recurrentRepository.save(r));
    }

    public List<RecurrentDto> findAll() {
        return recurrentRepository.findAll().stream().map(this::toDto).toList();
    }

    public RecurrentDto updateById(Long id, Map<String, Object> updates) {
        Recurrent r = recurrentRepository.findById(id).orElseThrow(() -> new NotFoundException("Recurrent not found"));
        if (updates.containsKey("name")) r.setName((String) updates.get("name"));
        if (updates.containsKey("establishment")) r.setEstablishment((String) updates.get("establishment"));
        if (updates.containsKey("periodicity")) {
            Object val = updates.get("periodicity");
            r.setPeriodicity(val != null ? ((Number) val).intValue() : null);
        }
        if (updates.containsKey("link")) r.setLink((String) updates.get("link"));
        // amount is intentionally not updatable here; use addPriceEntry instead
        return toDto(recurrentRepository.save(r));
    }

    @Transactional
    public RecurrentPriceEntryDto addPriceEntry(Long recurrentId, BigDecimal amount, OffsetDateTime recordedAt) {
        Recurrent r = recurrentRepository.findById(recurrentId)
                .orElseThrow(() -> new NotFoundException("Recurrent not found"));
        RecurrentPriceEntry entry = RecurrentPriceEntry.builder()
                .recurrent(r)
                .amount(amount)
                .recordedAt(recordedAt)
                .build();
        entry = priceEntryRepository.save(entry);
        r.setAmount(amount);
        recurrentRepository.save(r);
        return toPriceDto(entry);
    }

    public List<RecurrentPriceEntryDto> getPriceHistory(Long recurrentId) {
        if (!recurrentRepository.existsById(recurrentId)) {
            throw new NotFoundException("Recurrent not found");
        }
        return priceEntryRepository.findByRecurrentIdOrderByRecordedAtDesc(recurrentId)
                .stream().map(this::toPriceDto).toList();
    }

    public void deleteById(Long id) {
        Recurrent r = recurrentRepository.findById(id).orElseThrow(() -> new NotFoundException("Recurrent not found"));
        recurrentRepository.delete(r);
    }

    @Transactional
    public RecurrentLinkDto assignTransaction(Long recurrentId, Long transactionId) {
        Recurrent recurrent = recurrentRepository.findById(recurrentId)
                .orElseThrow(() -> new NotFoundException("Recurrent not found"));
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new NotFoundException("Transaction not found"));
        if (linkRepository.existsByRecurrentIdAndTransactionId(recurrentId, transactionId)) {
            throw new ConflictException("Link already exists");
        }
        RecurrentTransactionLink link = RecurrentTransactionLink.builder()
                .recurrent(recurrent)
                .transaction(transaction)
                .amountSnapshot(recurrent.getAmount())
                .build();
        linkRepository.save(link);
        return toLinkDto(link);
    }

    @Transactional
    public void unassignTransaction(Long recurrentId, Long transactionId) {
        RecurrentTransactionLink link = linkRepository.findByRecurrentIdAndTransactionId(recurrentId, transactionId)
                .orElseThrow(() -> new NotFoundException("Link not found"));
        linkRepository.delete(link);
    }

    public List<RecurrentLinkDto> getLinkedTransactions(Long recurrentId) {
        if (!recurrentRepository.existsById(recurrentId)) {
            throw new NotFoundException("Recurrent not found");
        }
        return linkRepository.findByRecurrentIdOrderByTransactionDateDesc(recurrentId)
                .stream().map(this::toLinkDto).toList();
    }

    private OffsetDateTime computeNextPredictedDate(Recurrent r) {
        if (r.getPeriodicity() == null) return null;
        List<RecurrentTransactionLink> links = linkRepository.findByRecurrentIdOrderByTransactionDateDesc(r.getId());
        OffsetDateTime base = links.isEmpty()
                ? r.getCreatedAt()
                : links.get(0).getTransaction().getDate();
        return base != null ? base.plusDays(r.getPeriodicity()) : null;
    }

    private RecurrentDto toDto(Recurrent r) {
        return RecurrentDto.builder()
                .id(r.getId())
                .name(r.getName())
                .amount(r.getAmount())
                .establishment(r.getEstablishment())
                .periodicity(r.getPeriodicity())
                .link(r.getLink())
                .nextPredictedDate(computeNextPredictedDate(r))
                .createdAt(r.getCreatedAt())
                .updatedAt(r.getUpdatedAt())
                .build();
    }

    private RecurrentPriceEntryDto toPriceDto(RecurrentPriceEntry e) {
        return RecurrentPriceEntryDto.builder()
                .id(e.getId())
                .amount(e.getAmount())
                .recordedAt(e.getRecordedAt())
                .build();
    }

    private RecurrentLinkDto toLinkDto(RecurrentTransactionLink l) {
        return RecurrentLinkDto.builder()
                .recurrentId(l.getRecurrent().getId())
                .transactionId(l.getTransaction().getId())
                .name(l.getRecurrent().getName())
                .establishment(l.getRecurrent().getEstablishment())
                .amountSnapshot(l.getAmountSnapshot())
                .transactionDate(l.getTransaction().getDate())
                .transactionAmount(l.getTransaction().getAmount())
                .build();
    }
}
