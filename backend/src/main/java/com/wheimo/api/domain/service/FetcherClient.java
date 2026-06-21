package com.wheimo.api.domain.service;

import com.wheimo.api.domain.dto.SyncResultMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Component
public class FetcherClient {

    private final String fetcherUrl;
    private final RestTemplate restTemplate;

    public FetcherClient(@Value("${fetcher.url}") String fetcherUrl) {
        this.fetcherUrl = fetcherUrl;
        this.restTemplate = new RestTemplate();
    }

    public List<SyncResultMessage.ImportedTransaction> parseXls(MultipartFile file, Long accountId, Long userId) throws Exception {
        String url = fetcherUrl + "/import/xls?accountId=" + accountId + "&userId=" + userId;

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("file", new MultipartFileResource(file));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        HttpEntity<MultiValueMap<String, Object>> request = new HttpEntity<>(body, headers);
        ResponseEntity<List<SyncResultMessage.ImportedTransaction>> response = restTemplate.exchange(
                url, HttpMethod.POST, request,
                new ParameterizedTypeReference<>() {});

        if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
            throw new RuntimeException("Fetcher returned error: " + response.getStatusCode());
        }
        return response.getBody();
    }
}
