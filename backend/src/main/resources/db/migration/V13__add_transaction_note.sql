ALTER TABLE transactions ADD COLUMN note TEXT;

CREATE INDEX idx_transactions_note ON transactions USING btree (lower(note));
