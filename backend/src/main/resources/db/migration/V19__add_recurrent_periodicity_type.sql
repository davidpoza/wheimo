ALTER TABLE recurrents
    ADD COLUMN periodicity_type VARCHAR(10) NOT NULL DEFAULT 'DAYS',
    ADD COLUMN periodicity_month INTEGER NULL;
