-- Alerts schema for M5

CREATE TABLE push_devices (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    installation_id VARCHAR(100) NOT NULL,
    token_value VARCHAR(255) NOT NULL,
    platform VARCHAR(50) NOT NULL,
    last_seen TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    revoked BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE (user_id, installation_id)
);

CREATE TABLE alert_subscriptions (
    id VARCHAR(36) PRIMARY KEY,
    student_id VARCHAR(36) NOT NULL,
    bus_id VARCHAR(36) NOT NULL,
    stop_id VARCHAR(36) NOT NULL,
    radius_meters INT NOT NULL DEFAULT 1000,
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id),
    FOREIGN KEY (bus_id) REFERENCES buses(id),
    FOREIGN KEY (stop_id) REFERENCES stops(id),
    UNIQUE (student_id, bus_id, stop_id)
);

CREATE TABLE alert_states (
    id VARCHAR(36) PRIMARY KEY,
    subscription_id VARCHAR(36) NOT NULL,
    trip_id VARCHAR(36) NOT NULL,
    state VARCHAR(50) NOT NULL, -- OUTSIDE, APPROACHING, NOTIFIED
    last_distance_meters DOUBLE PRECISION,
    notified_at TIMESTAMP,
    rearmed_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (subscription_id) REFERENCES alert_subscriptions(id),
    FOREIGN KEY (trip_id) REFERENCES trips(id),
    UNIQUE (subscription_id, trip_id)
);

CREATE TABLE notification_outbox (
    id VARCHAR(36) PRIMARY KEY,
    event_id VARCHAR(100) NOT NULL,
    recipient_id VARCHAR(36) NOT NULL,
    device_id VARCHAR(36) NOT NULL,
    payload JSON NOT NULL,
    state VARCHAR(50) NOT NULL DEFAULT 'PENDING', -- PENDING, SENT, FAILED
    attempts INT NOT NULL DEFAULT 0,
    next_attempt_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (recipient_id) REFERENCES users(id),
    FOREIGN KEY (device_id) REFERENCES push_devices(id)
);
