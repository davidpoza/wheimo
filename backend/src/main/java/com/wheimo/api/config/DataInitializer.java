package com.wheimo.api.config;

import com.wheimo.api.domain.entity.User;
import com.wheimo.api.domain.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements ApplicationRunner {

    private final AppAuthProperties authProperties;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(ApplicationArguments args) {
        String username = authProperties.getUsername();
        String password = authProperties.getPassword();

        userRepository.findByEmail(username).ifPresentOrElse(user -> {
            if (!passwordEncoder.matches(password, user.getPasswordHash())) {
                user.setPasswordHash(passwordEncoder.encode(password));
                userRepository.save(user);
                log.info("Auth user password updated for: {}", username);
            }
        }, () -> {
            User user = User.builder()
                    .email(username)
                    .passwordHash(passwordEncoder.encode(password))
                    .name("Admin")
                    .level("admin")
                    .active(true)
                    .build();
            userRepository.save(user);
            log.info("Auth user created: {}", username);
        });
    }
}
