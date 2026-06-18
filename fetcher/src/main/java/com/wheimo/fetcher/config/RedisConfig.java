package com.wheimo.fetcher.config;

import com.wheimo.fetcher.messaging.RedisConsumer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.listener.PatternTopic;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;
import org.springframework.web.client.RestTemplate;

@Configuration
public class RedisConfig {

    @Value("${app.redis.sync-requests-channel}")
    private String syncRequestsChannel;

    @Bean
    public StringRedisTemplate stringRedisTemplate(RedisConnectionFactory factory) {
        return new StringRedisTemplate(factory);
    }

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    @Bean
    public RedisMessageListenerContainer redisListenerContainer(
            RedisConnectionFactory factory,
            RedisConsumer redisConsumer) {
        RedisMessageListenerContainer container = new RedisMessageListenerContainer();
        container.setConnectionFactory(factory);
        container.addMessageListener(redisConsumer, new PatternTopic(syncRequestsChannel));
        return container;
    }
}
