CREATE TABLE attendance_records (
    id VARCHAR(36) PRIMARY KEY,
    trip_id VARCHAR(36) NOT NULL,
    student_id VARCHAR(36) NOT NULL,
    status VARCHAR(20) NOT NULL,
    source VARCHAR(20) NOT NULL,
    marked_by VARCHAR(36) NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    UNIQUE (trip_id, student_id),
    CONSTRAINT fk_attendance_trip FOREIGN KEY (trip_id) REFERENCES trips(id),
    CONSTRAINT fk_attendance_student FOREIGN KEY (student_id) REFERENCES users(id),
    CONSTRAINT fk_attendance_marked_by FOREIGN KEY (marked_by) REFERENCES users(id)
);
