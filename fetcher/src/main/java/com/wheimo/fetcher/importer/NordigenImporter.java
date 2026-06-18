package com.wheimo.fetcher.importer;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
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
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
@RequiredArgsConstructor
@Slf4j
public class NordigenImporter implements BankImporter {

    private static final String BASE_URL = "https://ob.nordigen.com/api/v2";
    private static final Pattern CONCEPT_SEP = Pattern.compile(",? CONCEPTO ");
    private static final Pattern HAS_RECEIVER = Pattern.compile("(BIZUM|TRANSFERENCIA) ([A-Z]* )?A FAVOR DE");
    private static final Pattern HAS_EMITTER = Pattern.compile("(BIZUM|TRANSFERENCIA) ([A-Z]* )?DE ");
    private static final Pattern WITH_CARD = Pattern.compile(",? CON LA TARJETA : ([0-9X]{16})");

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Override
    public SyncResultMessage fetchTransactions(SyncRequestMessage request, String decryptedPassword) {
        try {
            String token = login(request.getAccessId(), decryptedPassword);
            if (token == null) {
                return error(request, "login_failed");
            }

            String nordigenAccountId = request.getSettings() != null
                    ? request.getSettings().get("nordigenAccountId")
                    : null;

            JsonNode transactionsNode = getAccountTransactions(token, nordigenAccountId, request.getFrom());
            List<SyncResultMessage.ImportedTransaction> transactions = parseTransactions(transactionsNode, request.getAccountId());

            return SyncResultMessage.builder()
                    .accountId(request.getAccountId())
                    .userId(request.getUserId())
                    .transactions(transactions)
                    .balance(BigDecimal.ZERO)
                    .build();
        } catch (Exception e) {
            log.error("Nordigen import failed", e);
            return error(request, e.getMessage());
        }
    }

    private String login(String secretId, String secretKey) {
        try {
            String url = BASE_URL + "/token/new/";
            Map<String, String> body = Map.of("secret_id", secretId, "secret_key", secretKey);
            ResponseEntity<JsonNode> response = restTemplate.postForEntity(url, body, JsonNode.class);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return response.getBody().path("access").asText();
            }
        } catch (Exception e) {
            log.error("Nordigen login failed", e);
        }
        return null;
    }

    private JsonNode getAccountTransactions(String token, String accountId, String from) {
        String url = BASE_URL + "/accounts/" + accountId + "/transactions/";
        if (from != null) url += "?date_from=" + from;
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        ResponseEntity<JsonNode> response = restTemplate.exchange(url, HttpMethod.GET, new HttpEntity<>(headers), JsonNode.class);
        return response.getBody() != null ? response.getBody().path("transactions") : objectMapper.createObjectNode();
    }

    private List<SyncResultMessage.ImportedTransaction> parseTransactions(JsonNode transactionsNode, Long accountId) {
        List<SyncResultMessage.ImportedTransaction> result = new ArrayList<>();
        JsonNode booked = transactionsNode.path("booked");
        if (!booked.isArray()) return result;

        for (JsonNode t : booked) {
            String remittance = t.path("remittanceInformationUnstructured").asText("").trim();
            String concept = remittance;
            String emitter = "";
            String receiver = "";
            String assCard = "";

            if (HAS_RECEIVER.matcher(remittance).find()) {
                String[] parts = CONCEPT_SEP.split(remittance, 2);
                receiver = parts[0];
                if (parts.length > 1) concept = parts[1];
                receiver = HAS_RECEIVER.matcher(receiver).replaceFirst("");
            } else if (HAS_EMITTER.matcher(remittance).find()) {
                String[] parts = CONCEPT_SEP.split(remittance, 2);
                emitter = parts[0];
                if (parts.length > 1) concept = parts[1];
                emitter = HAS_EMITTER.matcher(emitter).replaceFirst("");
            } else {
                Matcher cardMatcher = WITH_CARD.matcher(remittance);
                if (cardMatcher.find()) {
                    assCard = cardMatcher.group(1);
                    concept = WITH_CARD.split(remittance)[0];
                }
            }

            BigDecimal amount = new BigDecimal(t.path("transactionAmount").path("amount").asText("0"));
            String currency = t.path("transactionAmount").path("currency").asText("EUR");
            String bookingDate = t.path("bookingDate").asText();
            String valueDate = t.path("valueDate").asText(bookingDate);

            String importId = generateImportId(accountId, BigDecimal.ZERO, bookingDate, concept, amount);

            result.add(SyncResultMessage.ImportedTransaction.builder()
                    .importId(importId)
                    .amount(amount)
                    .currency(currency)
                    .date(parseDate(bookingDate))
                    .valueDate(parseDate(valueDate))
                    .description(concept)
                    .emitterName(emitter)
                    .receiverName(receiver)
                    .assCard(assCard)
                    .receipt(false)
                    .balance(BigDecimal.ZERO)
                    .build());
        }

        // Calculate partial balances in ascending order (oldest first)
        Collections.reverse(result);
        return result;
    }

    private OffsetDateTime parseDate(String date) {
        if (date == null || date.isBlank()) return null;
        return LocalDate.parse(date).atStartOfDay().atOffset(ZoneOffset.UTC);
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
        return SyncResultMessage.builder()
                .accountId(req.getAccountId()).userId(req.getUserId()).error(msg).build();
    }
}
