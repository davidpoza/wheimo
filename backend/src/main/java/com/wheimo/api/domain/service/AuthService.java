package com.wheimo.api.domain.service;

import com.wheimo.api.config.AppAuthProperties;
import com.wheimo.api.domain.dto.AuthResponse;
import com.wheimo.api.domain.dto.LoginRequest;
import com.wheimo.api.domain.dto.UserDto;
import com.wheimo.api.domain.entity.User;
import com.wheimo.api.domain.repository.UserRepository;
import com.wheimo.api.security.JwtService;
import com.wheimo.api.web.exception.UnauthorizedException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AppAuthProperties authProperties;

    @Value("${app.jwt.refresh-expiration-ms}")
    private long refreshExpirationMs;

    public AuthResponse signIn(LoginRequest req, HttpServletResponse response) {
        if (!req.getEmail().equals(authProperties.getUsername())) {
            throw new UnauthorizedException("Invalid credentials");
        }
        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Invalid credentials"));
        if (!passwordEncoder.matches(req.getPassword(), user.getPasswordHash())) {
            throw new UnauthorizedException("Invalid credentials");
        }
        String accessToken = jwtService.generateToken(user.getId(), user.getLevel());
        String refreshToken = jwtService.generateRefreshToken(user.getId());
        addRefreshCookie(response, refreshToken);
        return AuthResponse.builder().accessToken(accessToken).user(toDto(user)).build();
    }

    public String refresh(String refreshToken) {
        if (!jwtService.isTokenValid(refreshToken)) {
            throw new UnauthorizedException("Invalid refresh token");
        }
        Long userId = jwtService.extractUserId(refreshToken);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UnauthorizedException("User not found"));
        return jwtService.generateToken(user.getId(), user.getLevel());
    }

    public void logout(HttpServletResponse response) {
        Cookie cookie = new Cookie("refresh_token", "");
        cookie.setMaxAge(0);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        response.addCookie(cookie);
    }

    private void addRefreshCookie(HttpServletResponse response, String token) {
        Cookie cookie = new Cookie("refresh_token", token);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge((int) (refreshExpirationMs / 1000));
        response.addCookie(cookie);
    }

    public UserDto toDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .lang(user.getLang())
                .theme(user.getTheme())
                .level(user.getLevel())
                .ignoredTagId(user.getIgnoredTag() != null ? user.getIgnoredTag().getId() : null)
                .build();
    }
}
