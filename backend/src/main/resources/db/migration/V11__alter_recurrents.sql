ALTER TABLE recurrents RENAME COLUMN emitter TO establishment;

ALTER TABLE recurrents
    ADD COLUMN periodicity INT,
    ADD COLUMN link TEXT;

ALTER TABLE recurrents DROP COLUMN transaction_id;
