ALTER TABLE recurrent_transaction_links ADD COLUMN units_snapshot NUMERIC(19, 4);

-- Backfill existing links with the recurrent's current units (best available approximation).
UPDATE recurrent_transaction_links l
SET units_snapshot = r.units
FROM recurrents r
WHERE l.recurrent_id = r.id
  AND r.units IS NOT NULL;
