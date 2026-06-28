package com.wheimo.fetcher.importer;

import com.wheimo.fetcher.dto.SyncResultMessage;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.poifs.filesystem.FileMagic;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
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
    // Openbank HTML exports use "dd/MM/yyyy" (cuenta) or "dd-MM-yyyy" (tarjeta).
    private static final DateTimeFormatter HTML_DATE_SLASH = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    private static final DateTimeFormatter HTML_DATE_DASH = DateTimeFormatter.ofPattern("dd-MM-yyyy");
    private static final DateTimeFormatter TIME_FMT = DateTimeFormatter.ofPattern("HH:mm");

    public SyncResultMessage parse(MultipartFile file, Long accountId) throws Exception {
        byte[] bytes = file.getBytes();
        // Openbank now exports an HTML document with an .xls extension; older exports were real OLE2 .xls.
        if (isOle2(bytes)) {
            return parseBinary(bytes, accountId);
        }
        return parseHtml(bytes, accountId);
    }

    private boolean isOle2(byte[] bytes) {
        try {
            return FileMagic.valueOf(new ByteArrayInputStream(bytes)) == FileMagic.OLE2;
        } catch (Exception e) {
            return false;
        }
    }

    // ---- HTML export (current Openbank format) ----

    private SyncResultMessage parseHtml(byte[] bytes, Long accountId) throws Exception {
        Document doc = Jsoup.parse(new ByteArrayInputStream(bytes), "ISO-8859-1", "");
        List<SyncResultMessage.ImportedTransaction> result = new ArrayList<>();
        BigDecimal totalBalance = null;

        Elements rows = doc.select("tr");
        int dateIdx = -1, timeIdx = -1, valueDateIdx = -1, descIdx = -1, amountIdx = -1, currencyIdx = -1;
        boolean headerFound = false;

        for (Element row : rows) {
            List<String> cells = cellTexts(row);

            // Account balance lives in the "Saldo:" header line, e.g. "42,00 EUR" (tarjeta has none).
            if (totalBalance == null) {
                int saldoLabel = indexOfCell(cells, "Saldo:");
                if (saldoLabel >= 0) {
                    String val = firstNonBlankAfter(cells, saldoLabel);
                    if (val != null) totalBalance = parseAmount(stripCurrency(val));
                    continue;
                }
            }

            if (!headerFound) {
                int imp = indexOfCell(cells, "Importe");
                if (imp >= 0) {
                    amountIdx = imp;
                    dateIdx = indexOfCell(cells, "Fecha Operación");
                    timeIdx = indexOfCell(cells, "Hora");           // only in tarjeta
                    valueDateIdx = indexOfCell(cells, "Fecha Valor"); // only in cuenta
                    descIdx = indexOfCell(cells, "Concepto");
                    currencyIdx = indexOfCell(cells, "Divisa");      // only in tarjeta
                    headerFound = true;
                }
                continue;
            }

            String dateStr = at(cells, dateIdx);
            String importeStr = at(cells, amountIdx);
            if (dateStr == null || dateStr.isBlank() || importeStr == null || importeStr.isBlank()) continue;

            LocalDate opDate = parseHtmlDate(dateStr);
            if (opDate == null) continue; // not a data row

            String timeStr = at(cells, timeIdx);
            String valueDateStr = at(cells, valueDateIdx);
            String description = at(cells, descIdx);
            String currency = at(cells, currencyIdx);
            BigDecimal amount = parseAmount(importeStr);

            LocalTime time = parseHtmlTime(timeStr);
            OffsetDateTime date = opDate.atTime(time).atOffset(ZoneOffset.UTC);
            LocalDate valueLocal = parseHtmlDate(valueDateStr);
            OffsetDateTime valueDate = valueLocal != null
                    ? valueLocal.atTime(time).atOffset(ZoneOffset.UTC)
                    : date;

            result.add(SyncResultMessage.ImportedTransaction.builder()
                    .importId(generateImportId(accountId, dateStr, timeStr, description, importeStr))
                    .amount(amount)
                    .currency(currency != null ? currency : "EUR")
                    .date(date)
                    .valueDate(valueDate)
                    .description(description)
                    .build());
        }

        return SyncResultMessage.builder()
                .accountId(accountId)
                .transactions(result)
                .balance(totalBalance)
                .build();
    }

    private List<String> cellTexts(Element row) {
        List<String> cells = new ArrayList<>();
        for (Element td : row.select("> td, > th")) {
            cells.add(td.text().trim());
        }
        return cells;
    }

    private int indexOfCell(List<String> cells, String label) {
        for (int i = 0; i < cells.size(); i++) {
            if (label.equalsIgnoreCase(cells.get(i))) return i;
        }
        return -1;
    }

    private String firstNonBlankAfter(List<String> cells, int from) {
        for (int i = from + 1; i < cells.size(); i++) {
            if (cells.get(i) != null && !cells.get(i).isBlank()) return cells.get(i);
        }
        return null;
    }

    private String at(List<String> cells, int idx) {
        if (idx < 0 || idx >= cells.size()) return null;
        String v = cells.get(idx);
        return (v == null || v.isBlank()) ? null : v;
    }

    private String stripCurrency(String raw) {
        return raw.replaceAll("[^0-9.,+-]", "").trim();
    }

    private LocalDate parseHtmlDate(String dateStr) {
        if (dateStr == null || dateStr.isBlank()) return null;
        DateTimeFormatter fmt = dateStr.contains("/") ? HTML_DATE_SLASH : HTML_DATE_DASH;
        try {
            return LocalDate.parse(dateStr.trim(), fmt);
        } catch (Exception e) {
            return null;
        }
    }

    private LocalTime parseHtmlTime(String timeStr) {
        if (timeStr == null || timeStr.isBlank()) return LocalTime.MIDNIGHT;
        try {
            return LocalTime.parse(timeStr.trim(), TIME_FMT);
        } catch (Exception e) {
            return LocalTime.MIDNIGHT;
        }
    }

    // ---- Legacy binary OLE2 export ----

    private SyncResultMessage parseBinary(byte[] bytes, Long accountId) throws Exception {
        List<SyncResultMessage.ImportedTransaction> result = new ArrayList<>();
        BigDecimal totalBalance = null;

        try (Workbook wb = new HSSFWorkbook(new ByteArrayInputStream(bytes))) {
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
