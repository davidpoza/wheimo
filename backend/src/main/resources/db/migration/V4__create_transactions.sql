CREATE TABLE transactions (
    id BIGSERIAL PRIMARY KEY,
    import_id TEXT UNIQUE,
    emitter_name TEXT,
    receiver_name TEXT,
    description TEXT,
    comments TEXT,
    ass_card TEXT,
    amount DECIMAL(15,2) NOT NULL,
    currency VARCHAR(10) NOT NULL,
    date TIMESTAMPTZ,
    value_date TIMESTAMPTZ,
    balance DECIMAL(15,2) DEFAULT 0.0,
    receipt BOOLEAN DEFAULT false,
    draft BOOLEAN DEFAULT false,
    favourite BOOLEAN DEFAULT false,
    account_id BIGINT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);

CREATE INDEX idx_transactions_account_id ON transactions(account_id);
CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_transactions_import_id ON transactions(import_id);
