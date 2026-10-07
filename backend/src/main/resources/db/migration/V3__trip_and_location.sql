-- Trip and Location schema for M4

CREATE TABLE trips (
    id VARCHAR(36) PRIMARY KEY,
    bus_id VARCHAR(36) NOT NULL,
    route_id VARCHAR(36) NOT NULL,
    incharge_id VARCHAR(36) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, PAUSED, ENDED, CANCELLED
    started_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (bus_id) REFERENCES buses(id),
    FOREIGN KEY (route_id) REFERENCES routes(id),
    FOREIGN KEY (incharge_id) REFERENCES users(id)
);

CREATE TABLE location_points (
    id VARCHAR(36) PRIMARY KEY,
    trip_id VARCHAR(36) NOT NULL,
    device_id VARCHAR(100) NOT NULL,
    sequence_num BIGINT NOT NULL,
    captured_time TIMESTAMP NOT NULL,
    received_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    accuracy DOUBLE PRECISION,
    speed DOUBLE PRECISION,
    heading DOUBLE PRECISION,
    FOREIGN KEY (trip_id) REFERENCES trips(id),
    UNIQUE (trip_id, device_id, sequence_num)
);

CREATE TABLE latest_bus_locations (
    trip_id VARCHAR(36) PRIMARY KEY,
    bus_id VARCHAR(36) NOT NULL,
    captured_time TIMESTAMP NOT NULL,
    received_time TIMESTAMP NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    accuracy DOUBLE PRECISION,
    speed DOUBLE PRECISION,
    heading DOUBLE PRECISION,
    FOREIGN KEY (trip_id) REFERENCES trips(id),
    FOREIGN KEY (bus_id) REFERENCES buses(id)
);
