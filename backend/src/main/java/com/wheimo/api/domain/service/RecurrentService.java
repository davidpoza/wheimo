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
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.YearMonth;
import java.time.ZoneOffset;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class RecurrentService {

    private final RecurrentRepository recurrentRepository;
    private final RecurrentPriceEntryRepository priceEntryRepository;
    private final RecurrentTransactionLinkRepository linkRepository;
    private final TransactionRepository transactionRepository;

    @Transactional
    public RecurrentDto create(String name, String establishment, BigDecimal amount, BigDecimal units,
                               Integer periodicity, String periodicityType, Integer periodicityMonth,
                               Integer periodicityDay, LocalDate startDate, String link) {
        Recurrent r = Recurrent.builder()
                .name(name)
                .establishment(establishment)
                .amount(amount != null ? amount : BigDecimal.ZERO)
                .units(units)
                .periodicity(periodicity)
                .periodicityType(periodicityType != null ? periodicityType : "DAYS")
                .periodicityMonth(periodicityMonth)
                .periodicityDay(periodicityDay)
                .startDate(startDate)
                .link(link)
                .build();
        Recurrent saved = recurrentRepository.save(r);
        // Record the creation values as the initial price entry so they appear in the history and chart.
        if (amount != null) {
            RecurrentPriceEntry initial = RecurrentPriceEntry.builder()
                    .recurrent(saved)
                    .amount(saved.getAmount())
                    .units(units)
                    .recordedAt(saved.getCreatedAt())
                    .build();
            priceEntryRepository.save(initial);
        }
        return toDto(saved);
    }

    public List<RecurrentDto> findAll() {
        return recurrentRepository.findAllByOrderByNameAsc().stream().map(this::toDto).toList();
    }

    public List<RecurrentDto> findUpcoming() {
        OffsetDateTime now = OffsetDateTime.now(ZoneOffset.UTC);
        LocalDate today = now.toLocalDate();
        OffsetDateTime windowStart = now.minusHours(48);
        OffsetDateTime windowEnd = now.plusHours(48);

        return recurrentRepository.findAll().stream()
                .filter(r -> {
                    if ("ANNUAL".equals(r.getPeriodicityType())) {
                        if (r.getPeriodicityMonth() == null) return false;
                        int targetMonth = r.getPeriodicityMonth();
                        LocalDate firstOfThisYear = LocalDate.of(today.getYear(), targetMonth, 1);
                        // If the 1st of the target month is today or in the past, use next year's occurrence
                        LocalDate nextOccurrence = today.isBefore(firstOfThisYear) ? firstOfThisYear : firstOfThisYear.plusYears(1);
                        LocalDate windowStartDate = nextOccurrence.minusDays(7);
                        return !today.isBefore(windowStartDate) && today.isBefore(nextOccurrence);
                    } else if ("MONTHLY".equals(r.getPeriodicityType())) {
                        if (r.getPeriodicityDay() == null) return false;
                        LocalDate nextOccurrence = computeNextMonthlyDate(today, r.getPeriodicityDay());
                        LocalDate windowStartDate = nextOccurrence.minusDays(7);
                        return !today.isBefore(windowStartDate) && today.isBefore(nextOccurrence);
                    } else {
                        OffsetDateTime next = computeNextPredictedDate(r);
                        return next != null && !next.isBefore(windowStart) && !next.isAfter(windowEnd);
                    }
                })
                .map(this::toDto)
                .toList();
    }

    public RecurrentDto updateById(Long id, Map<String, Object> updates) {
        Recurrent r = recurrentRepository.findById(id).orElseThrow(() -> new NotFoundException("Recurrent not found"));
        if (updates.containsKey("name")) r.setName((String) updates.get("name"));
        if (updates.containsKey("establishment")) r.setEstablishment((String) updates.get("establishment"));
        if (updates.containsKey("periodicity")) {
            Object val = updates.get("periodicity");
            r.setPeriodicity(val != null ? ((Number) val).intValue() : null);
        }
        if (updates.containsKey("periodicityType")) {
            r.setPeriodicityType((String) updates.get("periodicityType"));
        }
        if (updates.containsKey("periodicityMonth")) {
            Object val = updates.get("periodicityMonth");
            r.setPeriodicityMonth(val != null ? ((Number) val).intValue() : null);
        }
        if (updates.containsKey("periodicityDay")) {
            Object val = updates.get("periodicityDay");
            r.setPeriodicityDay(val != null ? ((Number) val).intValue() : null);
        }
        if (updates.containsKey("startDate")) {
            Object val = updates.get("startDate");
            r.setStartDate(val != null ? LocalDate.parse(val.toString()) : null);
        }
        if (updates.containsKey("link")) r.setLink((String) updates.get("link"));
        return toDto(recurrentRepository.save(r));
    }

    @Transactional
    public RecurrentPriceEntryDto addPriceEntry(Long recurrentId, BigDecimal amount, BigDecimal units, OffsetDateTime recordedAt) {
        Recurrent r = recurrentRepository.findById(recurrentId)
                .orElseThrow(() -> new NotFoundException("Recurrent not found"));
        RecurrentPriceEntry entry = RecurrentPriceEntry.builder()
                .recurrent(r)
                .amount(amount)
                .units(units)
                .recordedAt(recordedAt)
                .build();
        entry = priceEntryRepository.save(entry);
        r.setAmount(amount);
        if (units != null) {
            r.setUnits(units);
        }
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
                .unitsSnapshot(recurrent.getUnits())
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

    private LocalDate computeNextMonthlyDate(LocalDate today, int dayOfMonth) {
        YearMonth currentMonth = YearMonth.of(today.getYear(), today.getMonthValue());
        int clampedDay = Math.min(dayOfMonth, currentMonth.lengthOfMonth());
        LocalDate candidateThisMonth = LocalDate.of(today.getYear(), today.getMonthValue(), clampedDay);
        if (!today.isAfter(candidateThisMonth)) {
            return candidateThisMonth;
        }
        YearMonth nextMonth = currentMonth.plusMonths(1);
        int clampedDayNext = Math.min(dayOfMonth, nextMonth.lengthOfMonth());
        return LocalDate.of(nextMonth.getYear(), nextMonth.getMonthValue(), clampedDayNext);
    }

    // Returns null for ANNUAL type (no concept of next date) and for DAYS with no periodicity set.
    // Base anchor priority: last linked transaction -> startDate -> createdAt.
    // From the base, roll forward by `periodicity` days until reaching the first occurrence
    // that falls on or after today, so the result is always the next upcoming occurrence.
    private OffsetDateTime computeNextPredictedDate(Recurrent r) {
        if ("MONTHLY".equals(r.getPeriodicityType())) {
            if (r.getPeriodicityDay() == null) return null;
            LocalDate today = LocalDate.now(ZoneOffset.UTC);
            return computeNextMonthlyDate(today, r.getPeriodicityDay()).atStartOfDay().atOffset(ZoneOffset.UTC);
        }
        if (!"DAYS".equals(r.getPeriodicityType()) || r.getPeriodicity() == null) return null;
        int periodicity = r.getPeriodicity();
        if (periodicity <= 0) return null;

        List<RecurrentTransactionLink> links = linkRepository.findByRecurrentIdOrderByTransactionDateDesc(r.getId());
        LocalDate base;
        if (!links.isEmpty()) {
            OffsetDateTime txDate = links.get(0).getTransaction().getDate();
            base = txDate != null ? txDate.toLocalDate() : null;
        } else if (r.getStartDate() != null) {
            base = r.getStartDate();
        } else {
            base = r.getCreatedAt() != null ? r.getCreatedAt().toLocalDate() : null;
        }
        if (base == null) return null;

        LocalDate today = LocalDate.now(ZoneOffset.UTC);
        LocalDate next;
        if (!base.isBefore(today)) {
            next = base;
        } else {
            long elapsed = ChronoUnit.DAYS.between(base, today);
            long periods = (elapsed + periodicity - 1) / periodicity; // ceil division
            next = base.plusDays(periods * periodicity);
        }
        return next.atStartOfDay().atOffset(ZoneOffset.UTC);
    }

    private RecurrentDto toDto(Recurrent r) {
        return RecurrentDto.builder()
                .id(r.getId())
                .name(r.getName())
                .amount(r.getAmount())
                .units(r.getUnits())
                .establishment(r.getEstablishment())
                .periodicity(r.getPeriodicity())
                .periodicityType(r.getPeriodicityType())
                .periodicityMonth(r.getPeriodicityMonth())
                .periodicityDay(r.getPeriodicityDay())
                .startDate(r.getStartDate())
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
                .units(e.getUnits())
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
                .unitsSnapshot(l.getUnitsSnapshot())
                .transactionDate(l.getTransaction().getDate())
                .transactionAmount(l.getTransaction().getAmount())
                .build();
    }
}
