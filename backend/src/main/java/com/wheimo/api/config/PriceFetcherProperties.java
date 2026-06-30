package com.wheimo.api.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Getter
@Setter
@ConfigurationProperties(prefix = "price-fetcher")
public class PriceFetcherProperties {
    private Minetur minetur = new Minetur();

    @Getter
    @Setter
    public static class Minetur {
        private String apiKey;
    }
}
