package com.wheimo.api.domain.fetcher;

import com.wheimo.api.config.PriceFetcherProperties;
import com.wheimo.api.domain.entity.PriceReading;
import com.wheimo.api.domain.entity.PriceTracker;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

@Slf4j
@Component
public class GasoilPriceFetcher implements PriceFetcher {

    private static final String TYPE = "GASOIL";
    private static final String BASE_URL =
            "https://energia.serviciosmin.gob.es/ServiciosRestCarburantes/PreciosCarburantes/EstacionesTerrestres/FiltroMunicipio/{municipioId}";

    private final RestTemplate restTemplate;
    private final PriceFetcherProperties properties;

    public GasoilPriceFetcher(RestTemplateBuilder restTemplateBuilder, PriceFetcherProperties properties) {
        this.restTemplate = restTemplateBuilder.build();
        this.properties = properties;
    }

    @Override
    public String getType() {
        return TYPE;
    }

    @Override
    public List<PriceReading> fetch(PriceTracker tracker) {
        Map<String, Object> params = tracker.getParams() != null ? tracker.getParams() : Map.of();
        String productoKey = requiredString(params, "productoKey");
        List<MunicipioParam> municipios = parseMunicipios(params);

        List<PriceReading> readings = new ArrayList<>();
        for (MunicipioParam municipio : municipios) {
            try {
                List<PriceReading> stationReadings = fetchMunicipioStations(tracker, municipio.municipioId(), productoKey);
                if (stationReadings.isEmpty()) {
                    log.warn("MINETUR returned no stations with price for municipio={} key={}", municipio.municipioId(), productoKey);
                }
                readings.addAll(stationReadings);
            } catch (RestClientException ex) {
                if (municipios.size() == 1) {
                    throw ex;
                }
                log.error("MINETUR request failed for municipio={} key={}", municipio.municipioId(), productoKey, ex);
            }
        }
        return readings;
    }

    @Override
    public Map<String, Object> getParamSchema() {
        return Map.of(
                "products", List.of(
                        Map.of("id", "Precio Gasoleo A",              "label", "Gasóleo A"),
                        Map.of("id", "Precio Gasolina 95 E5",         "label", "Gasolina 95 E5"),
                        Map.of("id", "Precio Gasolina 95 E5 Premium", "label", "Gasolina 95 Premium"),
                        Map.of("id", "Precio Gasolina 98 E5",         "label", "Gasolina 98 E5"),
                        Map.of("id", "Precio Gasoleo Premium",        "label", "Gasóleo Premium"),
                        Map.of("id", "Precio Diésel Renovable",       "label", "Diésel Renovable"),
                        Map.of("id", "Precio Gases licuados del petróleo", "label", "GLP"),
                        Map.of("id", "Precio Gas Natural Comprimido", "label", "GNC"),
                        Map.of("id", "Precio Gas Natural Licuado",    "label", "GNL"),
                        Map.of("id", "Precio Hidrogeno",              "label", "Hidrógeno")
                ),
                "fields", List.of("municipioId", "municipios", "productoKey")
        );
    }

    @SuppressWarnings("unchecked")
    private List<PriceReading> fetchMunicipioStations(PriceTracker tracker, String municipioId, String productoKey) {
        HttpHeaders headers = new HttpHeaders();
        String apiKey = properties.getMinetur().getApiKey();
        if (apiKey != null && !apiKey.isBlank()) {
            headers.set("X-API-Key", apiKey);
        }

        Map<String, ?> response = restTemplate.exchange(
                BASE_URL,
                HttpMethod.GET,
                new HttpEntity<>(headers),
                Map.class,
                municipioId
        ).getBody();

        Object estaciones = response != null ? response.get("ListaEESSPrecio") : null;
        if (!(estaciones instanceof List<?> list)) {
            return List.of();
        }

        LocalDate today = LocalDate.now();
        List<PriceReading> readings = new ArrayList<>();
        for (Object item : list) {
            if (!(item instanceof Map<?, ?> station)) continue;
            Object rawPrice = station.get(productoKey);
            if (rawPrice == null) continue;
            String priceStr = rawPrice.toString().replace(',', '.').trim();
            if (priceStr.isBlank()) continue;
            try {
                BigDecimal price = new BigDecimal(priceStr);
                String rotulo = stringValue(station.get("Rótulo"), "?");
                String ideess = stringValue(station.get("IDEESS"), "0");
                String locationKey = rotulo + " (" + ideess + ")";
                readings.add(PriceReading.builder()
                        .tracker(tracker)
                        .readingDate(today)
                        .locationKey(locationKey)
                        .value(price)
                        .build());
            } catch (NumberFormatException e) {
                log.debug("Could not parse price '{}' for key={}", priceStr, productoKey);
            }
        }
        return readings;
    }

    @SuppressWarnings("unchecked")
    private List<MunicipioParam> parseMunicipios(Map<String, Object> params) {
        Object municipiosValue = params.get("municipios");
        if (municipiosValue instanceof List<?> municipios && !municipios.isEmpty()) {
            return municipios.stream()
                    .map(item -> {
                        if (item instanceof Map<?, ?> map) {
                            String municipioId = requiredString((Map<String, Object>) map, "municipioId");
                            return new MunicipioParam(municipioId);
                        }
                        return new MunicipioParam(stringValue(item, item.toString()));
                    })
                    .toList();
        }
        String municipioId = requiredString(params, "municipioId");
        return List.of(new MunicipioParam(municipioId));
    }

    private String requiredString(Map<String, Object> params, String key) {
        Object value = params.get(key);
        String str = value != null ? value.toString() : null;
        if (str == null || str.isBlank()) {
            throw new IllegalArgumentException("Missing required GASOIL param: " + key);
        }
        return str;
    }

    private String stringValue(Object value, String fallback) {
        return value != null && !value.toString().isBlank() ? value.toString().trim() : fallback;
    }

    private record MunicipioParam(String municipioId) {}
}
