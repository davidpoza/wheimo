-- note field is redundant with comments; both served as user-editable annotations
DROP INDEX IF EXISTS idx_transactions_note;
ALTER TABLE transactions DROP COLUMN IF EXISTS note;
