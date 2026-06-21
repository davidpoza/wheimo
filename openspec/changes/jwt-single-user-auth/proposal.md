## Why

The app currently supports multi-user signup via a public `/auth/signup` endpoint and database-driven authentication, but Wheimo is a personal finance tool for a single owner. No registration flow is needed — the sole user and password should be declared in `application.yml` (overridable via environment variables in docker-compose), removing unnecessary surface area and complexity.

## What Changes

- Remove the `POST /auth/signup` endpoint and all related code (`SignUpRequest`, `AuthService.signUp`)
- Add `app.auth.username` and `app.auth.password` properties to `application.yml` with development defaults
- Add a startup initializer that creates/syncs the configured user in the database on first boot
- Fix `UserDetailsServiceImpl` to load users by ID (fixing an existing bug where it searched by email with a numeric user-ID string)
- `AuthService.signIn` validates the login email against the configured username before accepting credentials

## Capabilities

### New Capabilities
- `single-user-auth`: Config-driven single-user authentication — credentials defined in `application.yml`, bootstrapped into DB on startup, JWT issued on login

### Modified Capabilities
<!-- none -->

## Impact

- `backend/src/main/resources/application.yml` — new `app.auth.*` properties
- `backend/src/main/java/com/wheimo/api/domain/service/AuthService.java` — remove `signUp`, harden `signIn`
- `backend/src/main/java/com/wheimo/api/web/controller/AuthController.java` — remove `POST /auth/signup`
- `backend/src/main/java/com/wheimo/api/domain/dto/SignUpRequest.java` — delete
- `backend/src/main/java/com/wheimo/api/security/UserDetailsServiceImpl.java` — load by ID instead of email
- New: `AppAuthProperties.java` (`@ConfigurationProperties`) and `DataInitializer.java` (startup user bootstrap)
- No DB schema changes required (existing `users` table and entity remain)
