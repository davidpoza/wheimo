-- Backfill an initial price entry (from the creation values) for recurrents that
-- have no price history yet, so the initial price/units show up in the modal table and chart.
INSERT INTO recurrent_price_entries (recurrent_id, amount, units, recorded_at)
SELECT r.id, r.amount, r.units, COALESCE(r.created_at, NOW())
FROM recurrents r
WHERE r.amount IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM recurrent_price_entries e WHERE e.recurrent_id = r.id
  );
