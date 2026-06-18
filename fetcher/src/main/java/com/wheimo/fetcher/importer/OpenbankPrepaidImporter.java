package com.wheimo.fetcher.importer;

import com.fasterxml.jackson.databind.JsonNode;
import com.wheimo.fetcher.dto.SyncRequestMessage;
import com.wheimo.fetcher.dto.SyncResultMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.*;

@Component
@RequiredArgsConstructor
@Slf4j
public class OpenbankPrepaidImporter implements BankImporter {

    private static final String BASE_URL = "https://www.openbank.es/api/retail/";

    private final RestTemplate restTemplate;

    @Override
    public SyncResultMessage fetchTransactions(SyncRequestMessage request, String decryptedPassword) {
        try {
            String token = login(request.getAccessId(), decryptedPassword);
            if (token == null) return error(request, "login_failed");

            String pan = request.getSettings() != null ? request.getSettings().get("pan") : null;
            List<SyncResultMessage.ImportedTransaction> transactions = getPrepaidTransactions(token, pan, request.getFrom(), request.getAccountId());

            return SyncResultMessage.builder()
                    .accountId(request.getAccountId()).userId(request.getUserId())
                    .transactions(transactions).balance(BigDecimal.ZERO).build();
        } catch (Exception e) {
            log.error("Openbank Prepaid import failed", e);
            return error(request, e.getMessage());
        }
    }

    private String login(String user, String password) {
        try {
            Map<String, String> body = Map.of("id", user, "password", password);
            ResponseEntity<JsonNode> response = restTemplate.postForEntity(BASE_URL + "session", body, JsonNode.class);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return response.getBody().path("session").path("id").asText();
            }
        } catch (Exception e) {
            log.error("Openbank prepaid login failed", e);
        }
        return null;
    }

    private List<SyncResultMessage.ImportedTransaction> getPrepaidTransactions(String token, String pan, String from, Long accountId) {
        List<SyncResultMessage.ImportedTransaction> result = new ArrayList<>();
        try {
            String url = BASE_URL + "cards/prepaid/" + pan + "/transactions";
            if (from != null) url += "?fromDate=" + from;
            HttpHeaders headers = new HttpHeaders();
            headers.set("authenticationdata", token);
            ResponseEntity<JsonNode> response = restTemplate.exchange(url, HttpMethod.GET, new HttpEntity<>(headers), JsonNode.class);
            if (response.getBody() == null) return result;

            for (JsonNode t : response.getBody().path("transactions")) {
                BigDecimal amount = new BigDecimal(t.path("amount").asText("0"));
                String currency = t.path("currency").asText("EUR");
                String date = t.path("transactionDate").asText();
                String description = t.path("concept").asText();
                BigDecimal balance = new BigDecimal(t.path("balance").asText("0"));

                result.add(SyncResultMessage.ImportedTransaction.builder()
                        .importId(generateImportId(accountId, balance, date, description, amount))
                        .amount(amount).currency(currency)
                        .date(parseDate(date)).valueDate(parseDate(date))
                        .description(description).assCard(pan).balance(balance).build());
            }
        } catch (Exception e) {
            log.error("Failed to fetch Openbank Prepaid transactions", e);
        }
        return result;
    }

    private OffsetDateTime parseDate(String date) {
        if (date == null || date.isBlank()) return null;
        return LocalDate.parse(date.substring(0, 10)).atStartOfDay().atOffset(ZoneOffset.UTC);
    }

    private String generateImportId(Long accountId, BigDecimal balance, String date, String desc, BigDecimal amount) {
        try {
            String raw = accountId + "|" + balance + "|" + date + "|" + (desc != null ? desc : "") + "|" + amount;
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hash = md.digest(raw.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (Exception e) {
            return UUID.randomUUID().toString();
        }
    }

    private SyncResultMessage error(SyncRequestMessage req, String msg) {
        return SyncResultMessage.builder().accountId(req.getAccountId()).userId(req.getUserId()).error(msg).build();
    }
}
