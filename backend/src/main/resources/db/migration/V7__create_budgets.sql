CREATE TABLE budgets (
    id BIGSERIAL PRIMARY KEY,
    value DECIMAL(15,2) NOT NULL,
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    tag_id BIGINT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);

CREATE INDEX idx_budgets_tag_id ON budgets(tag_id);
