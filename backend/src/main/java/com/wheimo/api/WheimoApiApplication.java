package com.wheimo.api;

import com.wheimo.api.config.PriceFetcherProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
@EnableConfigurationProperties(PriceFetcherProperties.class)
public class WheimoApiApplication {
    public static void main(String[] args) {
        SpringApplication.run(WheimoApiApplication.class, args);
    }
}
