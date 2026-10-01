package com.smartbus.attendance;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.smartbus.attendance.dto.MarkAttendanceRequest;
import com.smartbus.attendance.repository.AttendanceRecordRepository;
import com.smartbus.common.entity.College;
import com.smartbus.common.entity.User;
import com.smartbus.common.repository.CollegeRepository;
import com.smartbus.common.repository.UserRepository;
import com.smartbus.transport.entity.Bus;
import com.smartbus.transport.entity.Route;
import com.smartbus.transport.repository.BusRepository;
import com.smartbus.transport.repository.RouteRepository;
import com.smartbus.trip.entity.Trip;
import com.smartbus.trip.repository.TripRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@org.springframework.transaction.annotation.Transactional
public class AttendanceIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private AttendanceRecordRepository attendanceRecordRepository;

    @Autowired
    private TripRepository tripRepository;

    @Autowired
    private BusRepository busRepository;

    @Autowired
    private RouteRepository routeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CollegeRepository collegeRepository;

    private User testUser;
    private User testStudent;
    private Trip testTrip;

    @BeforeEach
    void setUp() {
        attendanceRecordRepository.deleteAll();
        tripRepository.deleteAll();
        busRepository.deleteAll();
        routeRepository.deleteAll();
        userRepository.deleteAll();
        collegeRepository.deleteAll();

        College testCollege = new College();
        testCollege.setId("college1");
        testCollege.setName("Test College");
        testCollege.setCode("TEST");
        testCollege.setTimezone("UTC");
        testCollege.setCreatedAt(Instant.now());
        testCollege.setUpdatedAt(Instant.now());
        testCollege = collegeRepository.save(testCollege);

        testUser = new User();
        testUser.setId("user1");
        testUser.setEmail("staff@test.com");
        testUser.setName("Staff");
        testUser.setRole("STAFF");
        testUser.setPasswordHash("pass");
        testUser.setCollege(testCollege);
        testUser.setStatus("ACTIVE");
        testUser.setCreatedAt(Instant.now());
        testUser.setUpdatedAt(Instant.now());
        testUser = userRepository.save(testUser);

        testStudent = new User();
        testStudent.setId("student1");
        testStudent.setEmail("student@test.com");
        testStudent.setName("Student");
        testStudent.setRole("STUDENT");
        testStudent.setPasswordHash("pass");
        testStudent.setCollege(testCollege);
        testStudent.setStatus("ACTIVE");
        testStudent.setCreatedAt(Instant.now());
        testStudent.setUpdatedAt(Instant.now());
        testStudent = userRepository.save(testStudent);

        Bus testBus = new Bus();
        testBus.setId("bus1");
        testBus.setRegistrationNumber("BUS-001");
        testBus.setDisplayName("Bus 001");
        testBus.setCapacity(50);
        testBus.setCollege(testCollege);
        testBus = busRepository.save(testBus);

        Route testRoute = new Route();
        testRoute.setId("route1");
        testRoute.setName("Route 1");
        testRoute.setDirection("INBOUND");
        testRoute.setCollege(testCollege);
        testRoute = routeRepository.save(testRoute);

        testTrip = new Trip();
        testTrip.setId("trip1");
        testTrip.setBus(testBus);
        testTrip.setRoute(testRoute);
        testTrip.setIncharge(testUser);
        testTrip.setStatus(com.smartbus.trip.entity.TripStatus.ACTIVE);
        testTrip.setStartedAt(Instant.now());
        testTrip = tripRepository.save(testTrip);
    }

    @Test
    @WithMockUser(username = "user1", roles = "STAFF")
    void testMarkAttendanceAndUniqueConstraint() throws Exception {
        MarkAttendanceRequest req = new MarkAttendanceRequest(testStudent.getId(), "PRESENT");

        mockMvc.perform(post("/api/attendance/trip/" + testTrip.getId() + "/manual")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk());

        assertThat(attendanceRecordRepository.findAll()).hasSize(1);

        // Attempting to mark attendance for the same student on the same trip again
        mockMvc.perform(post("/api/attendance/trip/" + testTrip.getId() + "/manual")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest()); // should fail due to uniqueness constraint
    }

    @Test
    @WithMockUser(username = "user1", roles = "STAFF")
    void testExportAttendanceCsv() throws Exception {
        MarkAttendanceRequest req = new MarkAttendanceRequest(testStudent.getId(), "PRESENT");

        mockMvc.perform(post("/api/attendance/trip/" + testTrip.getId() + "/manual")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk());

        String csvResponse = mockMvc.perform(get("/api/attendance/trip/" + testTrip.getId() + "/export"))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith("text/csv"))
                .andReturn().getResponse().getContentAsString();

        assertThat(csvResponse).contains("id,trip_id,student_id,status,source,marked_by,timestamp");
        assertThat(csvResponse).contains(testTrip.getId());
        assertThat(csvResponse).contains(testStudent.getId());
        assertThat(csvResponse).contains("PRESENT");
        assertThat(csvResponse).contains("MANUAL");
    }
}
