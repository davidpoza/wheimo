package com.wheimo.api.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "app.auth")
@Getter
@Setter
public class AppAuthProperties {
    private String username;
    private String password;
}
