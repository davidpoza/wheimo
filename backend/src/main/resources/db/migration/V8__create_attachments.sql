CREATE TABLE attachments (
    id BIGSERIAL PRIMARY KEY,
    description TEXT,
    filename TEXT NOT NULL,
    type TEXT NOT NULL,
    transaction_id BIGINT NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);

CREATE INDEX idx_attachments_transaction_id ON attachments(transaction_id);
