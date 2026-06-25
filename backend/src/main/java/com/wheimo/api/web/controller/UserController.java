package com.wheimo.api.web.controller;

import com.wheimo.api.domain.dto.ChangePasswordRequest;
import com.wheimo.api.domain.dto.UpdateUserRequest;
import com.wheimo.api.domain.dto.UserDto;
import com.wheimo.api.domain.service.UserService;
import com.wheimo.api.security.SecurityUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<UserDto> getMe() {
        return ResponseEntity.ok(userService.findById(SecurityUtils.getCurrentUserId()));
    }

    @PatchMapping("/me")
    public ResponseEntity<UserDto> updateMe(@RequestBody UpdateUserRequest req) {
        return ResponseEntity.ok(userService.updateById(SecurityUtils.getCurrentUserId(), req));
    }

    @PostMapping("/me/password")
    public ResponseEntity<Void> changePassword(@Valid @RequestBody ChangePasswordRequest req) {
        userService.changePassword(SecurityUtils.getCurrentUserId(), req);
        return ResponseEntity.ok().build();
    }
}
