package com.smartbus.transport;

import com.smartbus.common.entity.College;
import com.smartbus.common.entity.User;
import com.smartbus.transport.entity.*;
import com.smartbus.transport.repository.*;
import com.smartbus.transport.service.TransportService;
import com.smartbus.transport.dto.DTOs.*;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.dao.DataIntegrityViolationException;
import jakarta.persistence.EntityManager;
import java.time.LocalDate;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class TransportIntegrationTest {

    @Autowired
    private TransportService transportService;

    @Autowired
    private RouteStopRepository routeStopRepository;

    @Autowired
    private EntityManager entityManager;

    private College createCollege() {
        College college = new College();
        college.setId(UUID.randomUUID().toString());
        college.setName("Test College");
        college.setCode("TEST_C");
        college.setTimezone("UTC");
        college.setCreatedAt(java.time.Instant.now());
        college.setUpdatedAt(java.time.Instant.now());
        entityManager.persist(college);
        return college;
    }

    private User createUser(College college, String role) {
        User user = new User();
        user.setId(UUID.randomUUID().toString());
        user.setCollege(college);
        user.setName("Test User");
        user.setEmail(UUID.randomUUID().toString() + "@test.com");
        user.setRole(role);
        user.setCreatedAt(java.time.Instant.now());
        user.setUpdatedAt(java.time.Instant.now());
        entityManager.persist(user);
        return user;
    }

    @Test
    public void testAssignmentOverlaps() {
        College college = createCollege();
        
        BusDTO busDto = new BusDTO();
        busDto.collegeId = college.getId();
        busDto.registrationNumber = "AB123";
        busDto.displayName = "Bus 1";
        busDto.capacity = 40;
        busDto.active = true;
        Bus bus = transportService.createBus(busDto);
        
        RouteDTO routeDto = new RouteDTO();
        routeDto.collegeId = college.getId();
        routeDto.name = "Route 1";
        routeDto.direction = "INBOUND";
        routeDto.active = true;
        Route route = transportService.createRoute(routeDto);

        BusRouteAssignmentDTO assignment1 = new BusRouteAssignmentDTO();
        assignment1.busId = bus.getId();
        assignment1.routeId = route.getId();
        assignment1.validFrom = LocalDate.of(2023, 1, 1);
        assignment1.validTo = LocalDate.of(2023, 12, 31);
        transportService.createBusRouteAssignment(assignment1);

        BusRouteAssignmentDTO assignment2 = new BusRouteAssignmentDTO();
        assignment2.busId = bus.getId();
        assignment2.routeId = route.getId();
        assignment2.validFrom = LocalDate.of(2023, 6, 1);
        assignment2.validTo = LocalDate.of(2024, 6, 1);
        
        assertThrows(IllegalArgumentException.class, () -> {
            transportService.createBusRouteAssignment(assignment2);
        });
    }

    @Test
    public void testUniquenessConstraints() {
        College college = createCollege();

        RouteDTO routeDto = new RouteDTO();
        routeDto.collegeId = college.getId();
        routeDto.name = "Route 1";
        routeDto.direction = "INBOUND";
        routeDto.active = true;
        Route route = transportService.createRoute(routeDto);

        StopDTO stopDto1 = new StopDTO();
        stopDto1.collegeId = college.getId();
        stopDto1.name = "Stop 1";
        stopDto1.latitude = 10.0;
        stopDto1.longitude = 20.0;
        stopDto1.active = true;
        Stop stop1 = transportService.createStop(stopDto1);

        StopDTO stopDto2 = new StopDTO();
        stopDto2.collegeId = college.getId();
        stopDto2.name = "Stop 2";
        stopDto2.latitude = 11.0;
        stopDto2.longitude = 21.0;
        stopDto2.active = true;
        Stop stop2 = transportService.createStop(stopDto2);

        RouteStopDTO rsDto1 = new RouteStopDTO();
        rsDto1.routeId = route.getId();
        rsDto1.stopId = stop1.getId();
        rsDto1.sequenceNum = 1;
        transportService.createRouteStop(rsDto1);
        entityManager.flush();

        RouteStopDTO rsDto2 = new RouteStopDTO();
        rsDto2.routeId = route.getId();
        rsDto2.stopId = stop2.getId();
        rsDto2.sequenceNum = 1; // Duplicate sequence number

        assertThrows(Exception.class, () -> {
            transportService.createRouteStop(rsDto2);
            entityManager.flush();
        });
    }

    @Test
    public void testValidEnrolmentStates() {
        College college = createCollege();
        User student = createUser(college, "STUDENT");

        BusDTO busDto = new BusDTO();
        busDto.collegeId = college.getId();
        busDto.registrationNumber = "AB123";
        busDto.displayName = "Bus 1";
        busDto.capacity = 40;
        busDto.active = true;
        Bus bus = transportService.createBus(busDto);

        StopDTO stopDto = new StopDTO();
        stopDto.collegeId = college.getId();
        stopDto.name = "Stop 1";
        stopDto.latitude = 10.0;
        stopDto.longitude = 20.0;
        stopDto.active = true;
        Stop stop = transportService.createStop(stopDto);

        StudentEnrolmentDTO enrolDto = new StudentEnrolmentDTO();
        enrolDto.studentId = student.getId();
        enrolDto.busId = bus.getId();
        enrolDto.selectedStopId = stop.getId();
        enrolDto.status = "ACTIVE";
        
        StudentEnrolment enrolment = transportService.enrolStudent(enrolDto);
        assertNotNull(enrolment.getId());
        assertEquals("ACTIVE", enrolment.getStatus());
    }
}
