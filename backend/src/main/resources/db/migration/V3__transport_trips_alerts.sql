CREATE TABLE buses (
    id CHAR(36) PRIMARY KEY,
    university_id CHAR(36) NOT NULL,
    plate VARCHAR(30) NOT NULL UNIQUE,
    display_name VARCHAR(100) NOT NULL,
    tracker_provider VARCHAR(30) NOT NULL DEFAULT 'PHONE',
    tracker_device_id VARCHAR(120),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT fk_buses_university FOREIGN KEY (university_id) REFERENCES universities(id)
);
CREATE TABLE trips (
    id CHAR(36) PRIMARY KEY,
    bus_id CHAR(36) NOT NULL,
    route_id CHAR(36) NOT NULL,
    started_by CHAR(36) NOT NULL,
    status VARCHAR(20) NOT NULL,
    started_at TIMESTAMP(6) NOT NULL,
    ended_at TIMESTAMP(6),
    CONSTRAINT fk_trips_bus FOREIGN KEY (bus_id) REFERENCES buses(id),
    CONSTRAINT fk_trips_route FOREIGN KEY (route_id) REFERENCES routes(id)
);
CREATE INDEX idx_trips_bus_status ON trips(bus_id,status);
CREATE TABLE locations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    trip_id CHAR(36) NOT NULL,
    latitude DOUBLE NOT NULL,
    longitude DOUBLE NOT NULL,
    captured_at TIMESTAMP(6) NOT NULL,
    received_at TIMESTAMP(6) NOT NULL,
    speed DOUBLE,
    heading DOUBLE,
    accuracy DOUBLE,
    accepted BOOLEAN NOT NULL,
    reject_reason VARCHAR(120),
    UNIQUE(trip_id,captured_at),
    INDEX idx_locations_trip_time(trip_id,captured_at),
    CONSTRAINT fk_locations_trip FOREIGN KEY (trip_id) REFERENCES trips(id)
);
CREATE TABLE subscriptions (
    id CHAR(36) PRIMARY KEY,
    student_id CHAR(36) NOT NULL,
    stop_id CHAR(36) NOT NULL,
    lead_minutes INT NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    UNIQUE(student_id,stop_id)
);
CREATE TABLE notifications (
    id CHAR(36) PRIMARY KEY,
    student_id CHAR(36) NOT NULL,
    stop_id CHAR(36) NOT NULL,
    trip_id CHAR(36) NOT NULL,
    type VARCHAR(40) NOT NULL,
    status VARCHAR(20) NOT NULL,
    error_message VARCHAR(255),
    sent_at TIMESTAMP(6),
    read_at TIMESTAMP(6),
    UNIQUE(student_id,stop_id,trip_id,type)
);
