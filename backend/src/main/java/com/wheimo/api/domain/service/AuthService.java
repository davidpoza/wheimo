package com.wheimo.api.domain.service;

import com.wheimo.api.domain.dto.AuthResponse;
import com.wheimo.api.domain.dto.LoginRequest;
import com.wheimo.api.domain.dto.SignUpRequest;
import com.wheimo.api.domain.dto.UserDto;
import com.wheimo.api.domain.entity.User;
import com.wheimo.api.domain.repository.UserRepository;
import com.wheimo.api.security.JwtService;
import com.wheimo.api.web.exception.ConflictException;
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

    @Value("${app.jwt.refresh-expiration-ms}")
    private long refreshExpirationMs;

    public UserDto signUp(SignUpRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new ConflictException("Email already registered");
        }
        User user = User.builder()
                .email(req.getEmail())
                .passwordHash(passwordEncoder.encode(req.getPassword()))
                .name(req.getName())
                .build();
        user = userRepository.save(user);
        return toDto(user);
    }

    public AuthResponse signIn(LoginRequest req, HttpServletResponse response) {
        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Invalid credentials"));
        if (!passwordEncoder.matches(req.getPassword(), user.getPasswordHash())) {
            throw new UnauthorizedException("Invalid credentials");
        }
        String accessToken = jwtService.generateToken(user.getId(), user.getLevel());
        String refreshToken = jwtService.generateRefreshToken(user.getId());
        addRefreshCookie(response, refreshToken);
        return AuthResponse.builder().token(accessToken).user(toDto(user)).build();
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
