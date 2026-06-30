CREATE TABLE price_trackers (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    fetcher_type VARCHAR(64) NOT NULL,
    params JSONB NOT NULL DEFAULT '{}'::jsonb,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);

CREATE TABLE price_readings (
    id BIGSERIAL PRIMARY KEY,
    tracker_id BIGINT NOT NULL REFERENCES price_trackers(id) ON DELETE CASCADE,
    reading_date DATE NOT NULL,
    location_key VARCHAR(255) NOT NULL,
    value DECIMAL(15,4) NOT NULL,
    CONSTRAINT uq_price_readings_tracker_date_location UNIQUE (tracker_id, reading_date, location_key)
);

CREATE INDEX idx_price_readings_tracker_date ON price_readings(tracker_id, reading_date);
