CREATE TABLE transaction_tags (
    transaction_id BIGINT NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
    tag_id BIGINT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (transaction_id, tag_id)
);

CREATE INDEX idx_transaction_tags_tag_id ON transaction_tags(tag_id);
