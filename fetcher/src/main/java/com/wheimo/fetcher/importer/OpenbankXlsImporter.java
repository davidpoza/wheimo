package com.wheimo.fetcher.importer;

import com.wheimo.fetcher.dto.SyncResultMessage;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HexFormat;
import java.util.List;
import java.util.UUID;

@Component
@Slf4j
public class OpenbankXlsImporter {

    private static final int DATA_START_ROW = 10;
    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("dd-MM-yyyy");
    private static final DateTimeFormatter TIME_FMT = DateTimeFormatter.ofPattern("HH:mm");

    public SyncResultMessage parse(MultipartFile file, Long accountId) throws Exception {
        List<SyncResultMessage.ImportedTransaction> result = new ArrayList<>();
        BigDecimal totalBalance = null;

        try (Workbook wb = new HSSFWorkbook(file.getInputStream())) {
            Sheet sheet = wb.getSheetAt(0);
            for (int i = DATA_START_ROW; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) continue;

                String col0 = cellStr(row, 0);
                if ("Total".equalsIgnoreCase(col0)) {
                    String totalStr = cellStr(row, 11);
                    if (totalStr != null && !totalStr.isBlank()) {
                        totalBalance = parseAmount(totalStr);
                    }
                    continue;
                }

                String dateStr = cellStr(row, 1);
                if (dateStr == null || dateStr.isBlank()) continue;

                String timeStr = cellStr(row, 3);
                String description = cellStr(row, 5);
                String importeStr = cellStr(row, 11);
                String currency = cellStr(row, 12);

                if (importeStr == null || importeStr.isBlank()) continue;

                BigDecimal amount = parseAmount(importeStr);
                OffsetDateTime date = parseDateTime(dateStr, timeStr);

                result.add(SyncResultMessage.ImportedTransaction.builder()
                        .importId(generateImportId(accountId, dateStr, timeStr, description, importeStr))
                        .amount(amount)
                        .currency(currency != null ? currency : "EUR")
                        .date(date)
                        .valueDate(date)
                        .description(description)
                        .build());
            }
        }

        return SyncResultMessage.builder()
                .accountId(accountId)
                .transactions(result)
                .balance(totalBalance)
                .build();
    }

    private String cellStr(Row row, int idx) {
        Cell cell = row.getCell(idx);
        if (cell == null) return null;
        return cell.toString().trim();
    }

    private BigDecimal parseAmount(String raw) {
        return new BigDecimal(raw.replace(".", "").replace(",", "."));
    }

    private OffsetDateTime parseDateTime(String dateStr, String timeStr) {
        LocalDate date = LocalDate.parse(dateStr, DATE_FMT);
        LocalTime time = (timeStr != null && !timeStr.isBlank())
                ? LocalTime.parse(timeStr, TIME_FMT)
                : LocalTime.MIDNIGHT;
        return date.atTime(time).atOffset(ZoneOffset.UTC);
    }

    private String generateImportId(Long accountId, String date, String time, String desc, String amount) {
        try {
            String raw = accountId + "|" + date + "|" + (time != null ? time : "") + "|"
                    + (desc != null ? desc : "") + "|" + amount;
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hash = md.digest(raw.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (Exception e) {
            return UUID.randomUUID().toString();
        }
    }
}
