## Context

Wheimo is a single-owner personal finance app backed by Spring Boot + Spring Security. Authentication currently uses a `users` DB table: users register via `POST /auth/signup`, credentials are stored as BCrypt hashes, and login returns a short-lived JWT (access token) plus an `HttpOnly` cookie with a refresh token.

The User entity (`users` table) is referenced by accounts, transactions, budgets, and other domain objects — it must stay. Only the *authentication mechanism* changes: instead of reading credentials from DB, they are declared in `application.yml`.

Existing security flow that remains unchanged:
- JWT filter (`JwtAuthenticationFilter`) validates `Authorization: Bearer <token>` on every request
- `JwtService` generates/validates HMAC-SHA tokens
- `SecurityUtils.getCurrentUserId()` extracts the user ID from the security context (parsed from JWT subject)
- Refresh token stored in `HttpOnly` cookie

Known bug to fix as part of this work: `JwtAuthenticationFilter` calls `userDetailsService.loadUserByUsername(String.valueOf(userId))` — passing a numeric user-ID string — but `UserDetailsServiceImpl.loadUserByUsername` currently queries `findByEmail(email)`. This would fail at runtime for any authenticated request.

## Goals / Non-Goals

**Goals:**
- Single user: credentials (`username` = email, `password`) declared in `application.yml` with docker-compose-friendly env-var overrides and sane dev defaults
- Remove `POST /auth/signup` (and `SignUpRequest`, `AuthService.signUp`)
- Bootstrap the configured user in DB on startup so existing domain queries (user ID lookups) keep working
- Fix the `loadUserByUsername` bug: load by ID, not by email
- No changes to the JWT structure, token lifetimes, refresh flow, or logout flow

**Non-Goals:**
- Multi-user support or RBAC changes
- Password rotation UX (if password changes in config, DB is updated automatically on next startup)
- Removing the `users` table or User entity

## Decisions

### D1 — Credentials in application.yml, not DB

Store `app.auth.username` and `app.auth.password` (plaintext) in `application.yml`. Dev defaults are set directly in the file. Docker-compose overrides via env vars (`AUTH_USERNAME`, `AUTH_PASSWORD`).

Considered storing a pre-hashed BCrypt string in config but rejected: it's operationally awkward (must generate hash outside the app) and provides no meaningful security gain for a local personal deployment.

### D2 — `DataInitializer` bootstraps the DB user from config

A Spring `ApplicationRunner` bean runs at startup:
1. If no user exists with `email = app.auth.username` → create one with `passwordHash = BCrypt(app.auth.password)`.
2. If user exists but `passwordEncoder.matches(configPassword, user.passwordHash)` is `false` → update the hash (handles password rotation).

This keeps the rest of the app (transactions, accounts, etc.) working via user ID as before.

### D3 — `AuthService.signIn` validates against config username first

Before checking DB:
```
if (!req.getEmail().equals(configUsername)) throw UnauthorizedException
```
Then look up user by email (= config username) and validate password with `passwordEncoder.matches`. This prevents any residual DB user from being used to log in.

### D4 — `UserDetailsServiceImpl` loads by ID (fix existing bug)

Change `findByEmail(username)` → `findById(Long.parseLong(username))`. The JWT subject is the user's numeric ID; the filter passes it as a string. This aligns the implementation with actual usage.

### D5 — `AppAuthProperties` @ConfigurationProperties bean

Centralise config access in a typed bean rather than spreading `@Value` annotations across multiple classes.

## Risks / Trade-offs

- **Single point of failure**: If `app.auth.password` is lost, there is no reset flow. → Mitigation: document that changing the config value and restarting the app resets the hash automatically.
- **Plaintext password in yml**: For a personal local deployment this is acceptable; the yml should not be committed with a real password. → Mitigation: use env-var overrides in docker-compose; the default value is only for dev.
- **DataInitializer alters DB on startup**: If the wrong username is set, a stale user row could accumulate. → Mitigation: the initializer only creates/updates the single configured user; it does not delete old rows. Operators must clean up manually if they change the username.

## Migration Plan

1. Deploy new backend build — `DataInitializer` creates/updates the user row on startup.
2. Any in-flight refresh tokens continue to work (JWT structure unchanged).
3. Remove any client-side signup flows in the Angular frontend (separate task).
4. Verify login with the configured credentials before retiring old builds.

Rollback: revert the backend image; the `users` table is unchanged, so the previous version re-reads DB credentials as before.
