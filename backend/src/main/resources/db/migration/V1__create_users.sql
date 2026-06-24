CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name TEXT,
    password_hash VARCHAR(255) NOT NULL,
    active BOOLEAN DEFAULT false,
    lang VARCHAR(2) DEFAULT 'en',
    theme VARCHAR(10) DEFAULT 'light',
    level VARCHAR(10) DEFAULT 'user',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);
