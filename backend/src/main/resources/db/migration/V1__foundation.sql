CREATE TABLE app_users (
    id CHAR(36) PRIMARY KEY,
    email VARCHAR(320) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL,
    display_name VARCHAR(120) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
);

CREATE TABLE universities (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(180) NOT NULL,
    code VARCHAR(40) NOT NULL UNIQUE,
    active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE routes (
    id CHAR(36) PRIMARY KEY,
    university_id CHAR(36) NOT NULL,
    name VARCHAR(180) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT fk_routes_university FOREIGN KEY (university_id) REFERENCES universities(id)
);

CREATE TABLE stops (
    id CHAR(36) PRIMARY KEY,
    route_id CHAR(36) NOT NULL,
    name VARCHAR(180) NOT NULL,
    sequence_no INT NOT NULL,
    latitude DOUBLE NOT NULL,
    longitude DOUBLE NOT NULL,
    scheduled_time VARCHAR(10),
    UNIQUE(route_id, sequence_no),
    CONSTRAINT fk_stops_route FOREIGN KEY (route_id) REFERENCES routes(id)
);

CREATE INDEX idx_stops_route_sequence ON stops(route_id, sequence_no);
