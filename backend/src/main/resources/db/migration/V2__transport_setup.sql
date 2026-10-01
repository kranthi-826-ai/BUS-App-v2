-- Transport configuration schema for M3

CREATE TABLE buses (
    id VARCHAR(36) PRIMARY KEY,
    college_id VARCHAR(36) NOT NULL,
    registration_number VARCHAR(100) NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    capacity INT,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (college_id) REFERENCES colleges(id)
);

CREATE TABLE routes (
    id VARCHAR(36) PRIMARY KEY,
    college_id VARCHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    direction VARCHAR(50) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (college_id) REFERENCES colleges(id)
);

CREATE TABLE stops (
    id VARCHAR(36) PRIMARY KEY,
    college_id VARCHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (college_id) REFERENCES colleges(id)
);

CREATE TABLE route_stops (
    id VARCHAR(36) PRIMARY KEY,
    route_id VARCHAR(36) NOT NULL,
    stop_id VARCHAR(36) NOT NULL,
    sequence_num INT NOT NULL,
    scheduled_offset_mins INT,
    FOREIGN KEY (route_id) REFERENCES routes(id),
    FOREIGN KEY (stop_id) REFERENCES stops(id),
    UNIQUE (route_id, sequence_num),
    UNIQUE (route_id, stop_id)
);

CREATE TABLE bus_route_assignments (
    id VARCHAR(36) PRIMARY KEY,
    bus_id VARCHAR(36) NOT NULL,
    route_id VARCHAR(36) NOT NULL,
    valid_from DATE NOT NULL,
    valid_to DATE,
    FOREIGN KEY (bus_id) REFERENCES buses(id),
    FOREIGN KEY (route_id) REFERENCES routes(id)
);

CREATE TABLE incharge_assignments (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    bus_id VARCHAR(36) NOT NULL,
    valid_from DATE NOT NULL,
    valid_to DATE,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (bus_id) REFERENCES buses(id)
);

CREATE TABLE student_enrolments (
    id VARCHAR(36) PRIMARY KEY,
    student_id VARCHAR(36) NOT NULL,
    bus_id VARCHAR(36) NOT NULL,
    selected_stop_id VARCHAR(36) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id),
    FOREIGN KEY (bus_id) REFERENCES buses(id),
    FOREIGN KEY (selected_stop_id) REFERENCES stops(id)
);
