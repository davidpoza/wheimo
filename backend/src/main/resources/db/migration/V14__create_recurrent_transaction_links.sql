CREATE TABLE recurrent_transaction_links (
    id BIGSERIAL PRIMARY KEY,
    recurrent_id BIGINT NOT NULL REFERENCES recurrents(id) ON DELETE CASCADE,
    transaction_id BIGINT NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
    amount_snapshot NUMERIC(19, 4) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (recurrent_id, transaction_id)
);

CREATE INDEX idx_rtl_recurrent ON recurrent_transaction_links (recurrent_id);
CREATE INDEX idx_rtl_transaction ON recurrent_transaction_links (transaction_id);
