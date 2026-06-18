package com.wheimo.api.security;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

public class SecurityUtils {

    private SecurityUtils() {}

    public static Long getCurrentUserId() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetails ud) {
            return Long.parseLong(ud.getUsername());
        }
        throw new IllegalStateException("No authenticated user");
    }
}
