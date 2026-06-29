package com.wheimo.api.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "app.attachments.image")
@Getter
@Setter
public class AttachmentImageProperties {
    private int maxWidth = 1920;
    private int maxHeight = 1080;
    private float jpegQuality = 0.85f;
}
