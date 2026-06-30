package com.wheimo.api.domain.fetcher;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

@Component
public class PriceFetcherRegistry {

    private final Map<String, PriceFetcher> fetchers;

    public PriceFetcherRegistry(List<PriceFetcher> fetchers) {
        this.fetchers = fetchers.stream()
                .collect(Collectors.toUnmodifiableMap(PriceFetcher::getType, Function.identity()));
    }

    public Optional<PriceFetcher> findByType(String type) {
        return Optional.ofNullable(fetchers.get(type));
    }

    public List<PriceFetcher> findAll() {
        return fetchers.values().stream().toList();
    }
}
