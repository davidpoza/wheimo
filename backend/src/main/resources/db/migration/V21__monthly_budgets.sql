-- Rework budgets into a recurring monthly limit per tag.

-- 1. Collapse duplicates: keep only the most recent budget (highest id) per tag.
DELETE FROM budgets b
USING budgets newer
WHERE b.tag_id = newer.tag_id
  AND b.id < newer.id;

-- 2. Drop the manual date-range columns; the period is now the current calendar month.
ALTER TABLE budgets DROP COLUMN start_date;
ALTER TABLE budgets DROP COLUMN end_date;

-- 3. Enforce one budget per tag.
ALTER TABLE budgets ADD CONSTRAINT uq_budgets_tag UNIQUE (tag_id);
