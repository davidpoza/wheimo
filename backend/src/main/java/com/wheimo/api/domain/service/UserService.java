package com.wheimo.api.domain.service;

import com.wheimo.api.domain.dto.ChangePasswordRequest;
import com.wheimo.api.domain.dto.UpdateUserRequest;
import com.wheimo.api.domain.dto.UserDto;
import com.wheimo.api.domain.entity.Tag;
import com.wheimo.api.domain.entity.User;
import com.wheimo.api.domain.repository.TagRepository;
import com.wheimo.api.domain.repository.UserRepository;
import com.wheimo.api.web.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final TagRepository tagRepository;
    private final AuthService authService;
    private final PasswordEncoder passwordEncoder;

    public UserDto findById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("User not found"));
        return authService.toDto(user);
    }

    @Transactional
    public UserDto updateById(Long id, UpdateUserRequest req) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("User not found"));
        if (req.getLang() != null) user.setLang(req.getLang());
        if (req.getTheme() != null) user.setTheme(req.getTheme());
        if (req.getIgnoredTagId() != null) {
            Tag tag = tagRepository.findByIdAndUserId(req.getIgnoredTagId(), id)
                    .orElseThrow(() -> new NotFoundException("Tag not found"));
            user.setIgnoredTag(tag);
        }
        return authService.toDto(userRepository.save(user));
    }

    @Transactional
    public void changePassword(Long id, ChangePasswordRequest req) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("User not found"));
        if (!passwordEncoder.matches(req.getCurrentPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Current password is incorrect");
        }
        user.setPasswordHash(passwordEncoder.encode(req.getNewPassword()));
        userRepository.save(user);
    }
}
