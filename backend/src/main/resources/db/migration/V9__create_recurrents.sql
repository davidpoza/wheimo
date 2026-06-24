CREATE TABLE recurrents (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    amount DECIMAL(15,2) DEFAULT 0.0,
    emitter TEXT NOT NULL,
    transaction_id BIGINT REFERENCES transactions(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);
