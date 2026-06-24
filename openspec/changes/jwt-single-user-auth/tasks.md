## 1. Configuration

- [x] 1.1 Add `app.auth.username` and `app.auth.password` properties to `application.yml` with dev defaults (`admin@wheimo.com` / `admin`) using env-var syntax (`${AUTH_USERNAME:admin@wheimo.com}`)
- [x] 1.2 Create `AppAuthProperties.java` — `@ConfigurationProperties(prefix = "app.auth")` with `username` and `password` fields; enable it in main app class or via `@EnableConfigurationProperties`

## 2. User Bootstrap

- [x] 2.1 Create `DataInitializer.java` — `ApplicationRunner` bean that uses `AppAuthProperties` and `UserRepository` to create or update the configured user in DB on startup (BCrypt-encode the password)

## 3. Auth Service & Controller

- [x] 3.1 Inject `AppAuthProperties` into `AuthService`; in `signIn`, reject any email that does not match `app.auth.username` before doing DB lookup
- [x] 3.2 Remove `AuthService.signUp(SignUpRequest)` method
- [x] 3.3 Remove `POST /auth/signup` mapping from `AuthController`
- [x] 3.4 Delete `SignUpRequest.java` DTO

## 4. Fix UserDetailsServiceImpl

- [x] 4.1 Change `UserDetailsServiceImpl.loadUserByUsername` to load user by **ID** (`userRepository.findById(Long.parseLong(username))`) instead of by email — fixes the bug where the JWT filter passed a numeric user-ID string to a method that searched by email

## 5. Verification

- [x] 5.1 Start the backend and confirm `DataInitializer` creates the user row on first boot (check logs / DB)
- [x] 5.2 `POST /api/auth/login` with configured credentials returns HTTP 200 + JWT
- [x] 5.3 `POST /api/auth/login` with wrong password returns HTTP 401
- [x] 5.4 `POST /api/auth/login` with unknown email returns HTTP 401
- [x] 5.5 `POST /api/auth/signup` returns HTTP 404
- [x] 5.6 Authenticated request with valid JWT reaches the endpoint (HTTP 2xx)
- [x] 5.7 Authenticated request without JWT returns HTTP 403
