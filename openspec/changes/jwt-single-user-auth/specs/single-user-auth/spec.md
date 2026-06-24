## ADDED Requirements

### Requirement: Config-driven credentials
The system SHALL read a single set of credentials (`username` and `password`) from `application.yml` under `app.auth.*`. Both values SHALL be overridable via environment variables. The file SHALL define development defaults so the app starts without any environment configuration.

#### Scenario: App starts with dev defaults
- **WHEN** no `AUTH_USERNAME` or `AUTH_PASSWORD` environment variables are set
- **THEN** the application starts successfully using the defaults defined in `application.yml`

#### Scenario: App starts with env-var overrides
- **WHEN** `AUTH_USERNAME` and `AUTH_PASSWORD` are set as environment variables
- **THEN** the application uses those values as the effective credentials

---

### Requirement: User bootstrap on startup
The system SHALL ensure the configured user exists in the `users` table before accepting requests. On startup it SHALL create the user if absent, or update the BCrypt password hash if the configured password does not match the stored hash.

#### Scenario: First startup — user does not exist
- **WHEN** no user with `email = app.auth.username` exists in the database
- **THEN** the system creates a user row with that email and a BCrypt hash of `app.auth.password`

#### Scenario: Password rotated in config
- **WHEN** a user row with `email = app.auth.username` exists but the stored hash does not match `app.auth.password`
- **THEN** the system updates the stored hash to match the new configured password

#### Scenario: User already up to date
- **WHEN** a user row exists and the stored hash matches `app.auth.password`
- **THEN** the system makes no changes to the database

---

### Requirement: Login with configured credentials
The system SHALL issue a JWT access token and set a `refresh_token` HttpOnly cookie when the submitted email matches `app.auth.username` and the password is correct.

#### Scenario: Successful login
- **WHEN** `POST /api/auth/login` is called with the configured username and password
- **THEN** the response is HTTP 200 with `{ "token": "<jwt>", "user": { ... } }` and a `Set-Cookie: refresh_token=<token>; HttpOnly` header

#### Scenario: Wrong password
- **WHEN** `POST /api/auth/login` is called with the configured username but an incorrect password
- **THEN** the response is HTTP 401

#### Scenario: Unknown username
- **WHEN** `POST /api/auth/login` is called with an email that is not `app.auth.username`
- **THEN** the response is HTTP 401

---

### Requirement: No signup endpoint
The system SHALL NOT expose a `POST /auth/signup` endpoint. Any request to that path SHALL receive HTTP 404.

#### Scenario: Signup attempt
- **WHEN** `POST /api/auth/signup` is called with any body
- **THEN** the response is HTTP 404

---

### Requirement: Protected endpoints require valid JWT
The system SHALL reject requests to any non-auth endpoint that do not carry a valid `Authorization: Bearer <token>` header.

#### Scenario: Request without token
- **WHEN** an authenticated endpoint is called without an `Authorization` header
- **THEN** the response is HTTP 403

#### Scenario: Request with valid token
- **WHEN** an authenticated endpoint is called with a valid JWT issued by this system
- **THEN** the response is the expected resource (2xx)
