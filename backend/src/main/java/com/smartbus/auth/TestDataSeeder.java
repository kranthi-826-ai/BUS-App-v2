package com.smartbus.auth;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@Profile("test")
public class TestDataSeeder implements CommandLineRunner {

    private final JdbcTemplate jdbcTemplate;
    private final PasswordEncoder passwordEncoder;

    public TestDataSeeder(JdbcTemplate jdbcTemplate, PasswordEncoder passwordEncoder) {
        this.jdbcTemplate = jdbcTemplate;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        String collegeId = "college-1";
        jdbcTemplate.update("INSERT INTO colleges (id, name, code, active) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE active=active",
                collegeId, "Test College", "TESTCOL", true);

        String studentId = "student-1";
        jdbcTemplate.update("INSERT INTO users (id, college_id, email, password_hash, role, name, status) VALUES (?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE status=status",
                studentId, collegeId, "student@test.com", passwordEncoder.encode("student123"), "STUDENT", "Student User", "ACTIVE");

        String adminId = "admin-1";
        jdbcTemplate.update("INSERT INTO users (id, college_id, email, password_hash, role, name, status) VALUES (?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE status=status",
                adminId, collegeId, "admin@test.com", passwordEncoder.encode("admin123"), "ADMIN", "Admin User", "ACTIVE");

        String busId = "bus-1";
        jdbcTemplate.update("INSERT INTO buses (id, college_id, registration_number, display_name, capacity) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE capacity=capacity",
                busId, collegeId, "TEST-BUS-1", "Test Bus", 50);

        String routeId = "route-8";
        jdbcTemplate.update("INSERT INTO routes (id, college_id, name, direction) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE direction=direction",
                routeId, collegeId, "Route 8 - Mothinagar", "FORWARD");

        String stopId = "stop-mothinagar";
        jdbcTemplate.update("INSERT INTO stops (id, college_id, name, latitude, longitude) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE latitude=latitude",
                stopId, collegeId, "Mothinagar Main Road", 17.4475, 78.4377);

        jdbcTemplate.update("INSERT INTO route_stops (id, route_id, stop_id, sequence_num, scheduled_offset_mins) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE sequence_num=sequence_num",
                UUID.randomUUID().toString(), routeId, stopId, 1, 0);
                
        jdbcTemplate.update("INSERT INTO bus_route_assignments (id, bus_id, route_id, valid_from, valid_to) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE bus_id=bus_id",
                UUID.randomUUID().toString(), busId, routeId, java.time.LocalDate.now().minusDays(1), java.time.LocalDate.now().plusYears(1));
    }
}
