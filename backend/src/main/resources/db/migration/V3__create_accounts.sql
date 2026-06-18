CREATE TABLE accounts (
    id BIGSERIAL PRIMARY KEY,
    number VARCHAR(255) NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    balance DECIMAL(15,2) DEFAULT 0.0,
    bank_id VARCHAR(20) NOT NULL,
    access_id VARCHAR(255),
    access_password TEXT,
    settings JSONB,
    saving_target_amount DECIMAL(15,2),
    saving_initial_amount DECIMAL(15,2),
    saving_amount_func TEXT,
    saving_frequency VARCHAR(50),
    saving_init_date TIMESTAMPTZ DEFAULT NOW(),
    saving_target_date TIMESTAMPTZ,
    last_sync_count INT DEFAULT 0,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);

CREATE INDEX idx_accounts_user_id ON accounts(user_id);
