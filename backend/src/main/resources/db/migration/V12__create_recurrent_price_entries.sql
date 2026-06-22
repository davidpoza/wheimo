CREATE TABLE recurrent_price_entries (
    id BIGSERIAL PRIMARY KEY,
    recurrent_id BIGINT NOT NULL REFERENCES recurrents(id) ON DELETE CASCADE,
    amount DECIMAL(15,2) NOT NULL,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
