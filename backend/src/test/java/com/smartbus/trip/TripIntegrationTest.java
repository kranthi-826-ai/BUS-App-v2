package com.smartbus.trip;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.smartbus.common.entity.User;
import com.smartbus.common.repository.UserRepository;
import com.smartbus.transport.entity.Bus;
import com.smartbus.transport.entity.Route;
import com.smartbus.transport.repository.BusRepository;
import com.smartbus.transport.repository.RouteRepository;
import com.smartbus.common.entity.College;
import com.smartbus.common.repository.CollegeRepository;
import com.smartbus.trip.dto.LocationBatchRequest;
import com.smartbus.trip.dto.LocationPointDto;
import com.smartbus.trip.dto.StartTripRequest;
import com.smartbus.trip.entity.LatestBusLocation;
import com.smartbus.trip.entity.Trip;
import com.smartbus.trip.repository.LatestBusLocationRepository;
import com.smartbus.trip.repository.LocationPointRepository;
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
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@org.springframework.transaction.annotation.Transactional
public class TripIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private TripRepository tripRepository;

    @Autowired
    private LocationPointRepository locationPointRepository;

    @Autowired
    private LatestBusLocationRepository latestBusLocationRepository;

    @Autowired
    private BusRepository busRepository;

    @Autowired
    private RouteRepository routeRepository;

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private CollegeRepository collegeRepository;

    private User testUser;
    private Bus testBus;
    private Route testRoute;
    private College testCollege;

    @BeforeEach
    void setUp() {
        locationPointRepository.deleteAll(); tripRepository.deleteAll(); 
        latestBusLocationRepository.deleteAll();
        tripRepository.deleteAll();
        busRepository.deleteAll();
        routeRepository.deleteAll();
        userRepository.deleteAll();
        collegeRepository.deleteAll();

        testCollege = new College();
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

        testBus = new Bus();
        testBus.setId("bus1");
        testBus.setRegistrationNumber("BUS-001");
        testBus.setDisplayName("Bus 001");
        testBus.setCapacity(50);
        testBus.setCollege(testCollege);
        testBus = busRepository.save(testBus);

        testRoute = new Route();
        testRoute.setId("route1");
        testRoute.setName("Route 1");
        testRoute.setDirection("INBOUND");
        testRoute.setCollege(testCollege);
        testRoute = routeRepository.save(testRoute);
    }

    @Test
    @WithMockUser(username = "user1", roles = "STAFF")
    void testActiveTripUniqueness() throws Exception {
        StartTripRequest request = new StartTripRequest();
        request.setBusId(testBus.getId());
        request.setRouteId(testRoute.getId());

        mockMvc.perform(post("/api/v1/trips")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());

        // Second time should fail
        mockMvc.perform(post("/api/v1/trips")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest()); // Or whatever handles IllegalArgumentException
    }

    @Test
    @WithMockUser(username = "user1", roles = "STAFF")
    void testLocationIngestionAndLatestUpdate() throws Exception {
        StartTripRequest request = new StartTripRequest();
        request.setBusId(testBus.getId());
        request.setRouteId(testRoute.getId());

        String res = mockMvc.perform(post("/api/v1/trips")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andReturn().getResponse().getContentAsString();

        String tripId = objectMapper.readTree(res).get("id").asText();

        // Submit locations
        LocationBatchRequest batch = new LocationBatchRequest();
        batch.setDeviceId("device1");

        LocationPointDto pt1 = new LocationPointDto();
        pt1.setSequenceNum(1L);
        pt1.setCapturedTime(Instant.now().minus(1, ChronoUnit.MINUTES));
        pt1.setLatitude(12.0);
        pt1.setLongitude(77.0);

        LocationPointDto pt2 = new LocationPointDto();
        pt2.setSequenceNum(2L);
        pt2.setCapturedTime(Instant.now());
        pt2.setLatitude(12.1);
        pt2.setLongitude(77.1);

        batch.setPoints(List.of(pt1, pt2));

        mockMvc.perform(post("/api/v1/trips/" + tripId + "/locations")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(batch)))
                .andExpect(status().isAccepted());

        assertThat(locationPointRepository.findAll()).hasSize(2);

        Optional<LatestBusLocation> latest = latestBusLocationRepository.findById(tripId);
        assertThat(latest).isPresent();
        assertThat(latest.get().getLatitude()).isEqualTo(12.1);

        // Submit duplicate pt1
        LocationBatchRequest batchDuplicate = new LocationBatchRequest();
        batchDuplicate.setDeviceId("device1");
        batchDuplicate.setPoints(List.of(pt1));

        mockMvc.perform(post("/api/v1/trips/" + tripId + "/locations")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(batchDuplicate)))
                .andExpect(status().isAccepted());

        assertThat(locationPointRepository.findAll()).hasSize(2); // no new points

        // Submit stale point (very old)
        LocationPointDto ptStale = new LocationPointDto();
        ptStale.setSequenceNum(3L);
        ptStale.setCapturedTime(Instant.now().minus(2, ChronoUnit.DAYS));
        ptStale.setLatitude(10.0);
        ptStale.setLongitude(70.0);

        LocationBatchRequest batchStale = new LocationBatchRequest();
        batchStale.setDeviceId("device1");
        batchStale.setPoints(List.of(ptStale));

        mockMvc.perform(post("/api/v1/trips/" + tripId + "/locations")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(batchStale)))
                .andExpect(status().isAccepted());

        assertThat(locationPointRepository.findAll()).hasSize(2); // stale ignored

        // Submit out-of-order point (not updating latest)
        LocationPointDto ptOutOrder = new LocationPointDto();
        ptOutOrder.setSequenceNum(4L);
        ptOutOrder.setCapturedTime(Instant.now().minus(30, ChronoUnit.SECONDS)); // between pt1 and pt2
        ptOutOrder.setLatitude(12.05);
        ptOutOrder.setLongitude(77.05);

        LocationBatchRequest batchOutOrder = new LocationBatchRequest();
        batchOutOrder.setDeviceId("device1");
        batchOutOrder.setPoints(List.of(ptOutOrder));

        mockMvc.perform(post("/api/v1/trips/" + tripId + "/locations")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(batchOutOrder)))
                .andExpect(status().isAccepted());

        assertThat(locationPointRepository.findAll()).hasSize(3); // accepted

        latest = latestBusLocationRepository.findById(tripId);
        assertThat(latest.get().getLatitude()).isEqualTo(12.1); // still pt2
    }
}
