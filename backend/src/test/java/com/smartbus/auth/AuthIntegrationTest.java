package com.smartbus.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.smartbus.auth.dto.AuthResponse;
import com.smartbus.auth.dto.LoginRequest;
import com.smartbus.auth.dto.RefreshRequest;
import com.smartbus.common.entity.College;
import com.smartbus.common.entity.User;
import com.smartbus.common.repository.CollegeRepository;
import com.smartbus.common.repository.UserRepository;
import com.smartbus.common.repository.RefreshTokenRepository;
import com.smartbus.transport.repository.BusRouteAssignmentRepository;
import com.smartbus.transport.repository.InchargeAssignmentRepository;
import com.smartbus.transport.repository.StudentEnrolmentRepository;
import com.smartbus.transport.repository.RouteStopRepository;
import com.smartbus.transport.repository.StopRepository;
import com.smartbus.transport.repository.BusRepository;
import com.smartbus.transport.repository.RouteRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.time.Instant;
import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@org.springframework.transaction.annotation.Transactional
public class AuthIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private CollegeRepository collegeRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;
    @Autowired private InchargeAssignmentRepository inchargeAssignmentRepository;
    @Autowired private StudentEnrolmentRepository studentEnrolmentRepository;
    @Autowired private BusRouteAssignmentRepository busRouteAssignmentRepository;
    @Autowired private RouteStopRepository routeStopRepository;
    @Autowired private BusRepository busRepository;
    @Autowired private RouteRepository routeRepository;
    @Autowired private StopRepository stopRepository;

    private User activeUser;
    private User disabledUser;

    @BeforeEach
    void setup() {
        refreshTokenRepository.deleteAll();
        inchargeAssignmentRepository.deleteAll();
        studentEnrolmentRepository.deleteAll();
        busRouteAssignmentRepository.deleteAll();
        routeStopRepository.deleteAll();
        busRepository.deleteAll();
        routeRepository.deleteAll();
        stopRepository.deleteAll();
        userRepository.deleteAll();
        collegeRepository.deleteAll();

        College college = new College();
        college.setId(UUID.randomUUID().toString());
        college.setName("Test College");
        college.setCode("TEST");
        college.setTimezone("UTC");
        college.setActive(true);
        college.setCreatedAt(Instant.now());
        college.setUpdatedAt(Instant.now());
        collegeRepository.save(college);

        activeUser = new User();
        activeUser.setId(UUID.randomUUID().toString());
        activeUser.setCollege(college);
        activeUser.setName("Active Student");
        activeUser.setEmail("active@test.com");
        activeUser.setPasswordHash(passwordEncoder.encode("password"));
        activeUser.setRole("STUDENT");
        activeUser.setStatus("ACTIVE");
        activeUser.setCreatedAt(Instant.now());
        activeUser.setUpdatedAt(Instant.now());
        userRepository.save(activeUser);
        
        disabledUser = new User();
        disabledUser.setId(UUID.randomUUID().toString());
        disabledUser.setCollege(college);
        disabledUser.setName("Disabled Student");
        disabledUser.setEmail("disabled@test.com");
        disabledUser.setPasswordHash(passwordEncoder.encode("password"));
        disabledUser.setRole("STUDENT");
        disabledUser.setStatus("DISABLED");
        disabledUser.setCreatedAt(Instant.now());
        disabledUser.setUpdatedAt(Instant.now());
        userRepository.save(disabledUser);
    }

    @Test
    void testLoginSuccess() throws Exception {
        LoginRequest req = new LoginRequest();
        req.setEmail("active@test.com");
        req.setPassword("password");

        MvcResult result = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andReturn();
        
        AuthResponse res = objectMapper.readValue(result.getResponse().getContentAsString(), AuthResponse.class);
        assertNotNull(res.getAccessToken());
        assertNotNull(res.getRefreshToken());
        assertEquals("STUDENT", res.getRole());
    }

    @Test
    void testLoginDisabledUser() throws Exception {
        LoginRequest req = new LoginRequest();
        req.setEmail("disabled@test.com");
        req.setPassword("password");

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isForbidden());
    }
    
    @Test
    void testRefreshReuse() throws Exception {
        // 1. Login
        LoginRequest req = new LoginRequest();
        req.setEmail("active@test.com");
        req.setPassword("password");

        MvcResult result = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andReturn();
        
        AuthResponse loginRes = objectMapper.readValue(result.getResponse().getContentAsString(), AuthResponse.class);
        
        // 2. Refresh 1 (Success)
        RefreshRequest refReq = new RefreshRequest();
        refReq.setRefreshToken(loginRes.getRefreshToken());
        
        MvcResult refreshResult = mockMvc.perform(post("/api/auth/refresh")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(refReq)))
                .andExpect(status().isOk())
                .andReturn();
                
        AuthResponse refreshRes = objectMapper.readValue(refreshResult.getResponse().getContentAsString(), AuthResponse.class);
        assertNotEquals(loginRes.getRefreshToken(), refreshRes.getRefreshToken());
        
        // 3. Reuse old refresh token (Forbidden)
        mockMvc.perform(post("/api/auth/refresh")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(refReq)))
                .andExpect(status().isUnauthorized());
                
        // 4. Try using the new token (Should fail because family is revoked)
        RefreshRequest refReq2 = new RefreshRequest();
        refReq2.setRefreshToken(refreshRes.getRefreshToken());
        
        mockMvc.perform(post("/api/auth/refresh")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(refReq2)))
                .andExpect(status().isUnauthorized());
    }
}
