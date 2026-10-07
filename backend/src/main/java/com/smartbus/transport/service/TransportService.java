package com.smartbus.transport.service;

import com.smartbus.transport.entity.*;
import com.smartbus.transport.repository.*;
import com.smartbus.transport.dto.DTOs.*;
import com.smartbus.common.entity.College;
import com.smartbus.common.entity.User;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import jakarta.persistence.EntityManager;
import java.util.UUID;
import java.util.List;

@Service
@Transactional
public class TransportService {
    private final BusRepository busRepository;
    private final RouteRepository routeRepository;
    private final StopRepository stopRepository;
    private final RouteStopRepository routeStopRepository;
    private final BusRouteAssignmentRepository busRouteAssignmentRepository;
    private final InchargeAssignmentRepository inchargeAssignmentRepository;
    private final StudentEnrolmentRepository studentEnrolmentRepository;
    private final EntityManager entityManager;

    public TransportService(BusRepository busRepository, RouteRepository routeRepository, StopRepository stopRepository,
                            RouteStopRepository routeStopRepository, BusRouteAssignmentRepository busRouteAssignmentRepository,
                            InchargeAssignmentRepository inchargeAssignmentRepository, StudentEnrolmentRepository studentEnrolmentRepository,
                            EntityManager entityManager) {
        this.busRepository = busRepository;
        this.routeRepository = routeRepository;
        this.stopRepository = stopRepository;
        this.routeStopRepository = routeStopRepository;
        this.busRouteAssignmentRepository = busRouteAssignmentRepository;
        this.inchargeAssignmentRepository = inchargeAssignmentRepository;
        this.studentEnrolmentRepository = studentEnrolmentRepository;
        this.entityManager = entityManager;
    }

    public Bus createBus(BusDTO dto) {
        Bus bus = new Bus();
        bus.setId(dto.id != null ? dto.id : UUID.randomUUID().toString());
        bus.setCollege(entityManager.getReference(College.class, dto.collegeId));
        bus.setRegistrationNumber(dto.registrationNumber);
        bus.setDisplayName(dto.displayName);
        bus.setCapacity(dto.capacity);
        bus.setActive(dto.active != null ? dto.active : true);
        return busRepository.save(bus);
    }
    public List<Bus> getAllBuses() { return busRepository.findAll(); }

    public Route createRoute(RouteDTO dto) {
        Route route = new Route();
        route.setId(dto.id != null ? dto.id : UUID.randomUUID().toString());
        route.setCollege(entityManager.getReference(College.class, dto.collegeId));
        route.setName(dto.name);
        route.setDirection(dto.direction);
        route.setActive(dto.active != null ? dto.active : true);
        return routeRepository.save(route);
    }
    public List<Route> getAllRoutes() { return routeRepository.findAll(); }

    public List<Route> getRoutesForCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        boolean administrator = authentication.getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals("ROLE_ADMIN"));
        if (administrator) return routeRepository.findAll();
        User user = entityManager.find(User.class, authentication.getName());
        if (user == null || user.getCollege() == null) return List.of();
        return routeRepository.findByCollegeIdAndActiveTrue(user.getCollege().getId());
    }

    public void requireRouteVisibleToCurrentUser(String routeId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        boolean administrator = authentication.getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals("ROLE_ADMIN"));
        if (administrator) return;
        User user = entityManager.find(User.class, authentication.getName());
        Route route = routeRepository.findById(routeId)
                .orElseThrow(() -> new IllegalArgumentException("Route not found"));
        if (user == null || user.getCollege() == null
                || !user.getCollege().getId().equals(route.getCollege().getId())) {
            throw new IllegalArgumentException("Route is not available for this college");
        }
    }

    public List<Bus> getBusesForCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        boolean administrator = authentication.getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals("ROLE_ADMIN"));
        if (administrator) return busRepository.findAll();
        User user = entityManager.find(User.class, authentication.getName());
        if (user == null || user.getCollege() == null) return List.of();
        return busRepository.findByCollegeIdAndActiveTrue(user.getCollege().getId());
    }

    public List<Bus> getBusesForRoute(String routeId) {
        requireRouteVisibleToCurrentUser(routeId);
        return busRouteAssignmentRepository.findActiveBusesForRoute(routeId, java.time.LocalDate.now());
    }

    public StudentEnrolment getCurrentStudentEnrolment() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return studentEnrolmentRepository.findByStudentIdAndStatus(authentication.getName(), "ACTIVE")
                .orElse(null);
    }

    public Stop createStop(StopDTO dto) {
        Stop stop = new Stop();
        stop.setId(dto.id != null ? dto.id : UUID.randomUUID().toString());
        stop.setCollege(entityManager.getReference(College.class, dto.collegeId));
        stop.setName(dto.name);
        stop.setLatitude(dto.latitude);
        stop.setLongitude(dto.longitude);
        stop.setActive(dto.active != null ? dto.active : true);
        return stopRepository.save(stop);
    }
    public List<Stop> getAllStops() { return stopRepository.findAll(); }
    
    public List<RouteStop> getStopsForRoute(String routeId) {
        return routeStopRepository.findByRouteIdOrderBySequenceNumAsc(routeId);
    }

    public RouteStop createRouteStop(RouteStopDTO dto) {
        RouteStop rs = new RouteStop();
        rs.setId(dto.id != null ? dto.id : UUID.randomUUID().toString());
        Route route = routeRepository.findById(dto.routeId)
            .orElseThrow(() -> new IllegalArgumentException("Route not found"));
        Stop stop = stopRepository.findById(dto.stopId)
            .orElseThrow(() -> new IllegalArgumentException("Stop not found"));
        if (!route.getCollege().getId().equals(stop.getCollege().getId())) {
            throw new IllegalArgumentException("Route and stop must belong to the same college");
        }
        rs.setRoute(route);
        rs.setStop(stop);
        rs.setSequenceNum(dto.sequenceNum);
        rs.setScheduledOffsetMins(dto.scheduledOffsetMins);
        return routeStopRepository.save(rs);
    }

    public BusRouteAssignment createBusRouteAssignment(BusRouteAssignmentDTO dto) {
        if (busRouteAssignmentRepository.hasOverlappingBusAssignment(dto.busId, dto.validFrom, dto.validTo)) {
            throw new IllegalArgumentException("Overlapping assignment for bus");
        }
        if (busRouteAssignmentRepository.hasOverlappingRouteAssignment(dto.routeId, dto.validFrom, dto.validTo)) {
            throw new IllegalArgumentException("Overlapping assignment for route");
        }
        BusRouteAssignment assignment = new BusRouteAssignment();
        assignment.setId(dto.id != null ? dto.id : UUID.randomUUID().toString());
        Bus bus = busRepository.findById(dto.busId)
            .orElseThrow(() -> new IllegalArgumentException("Bus not found"));
        Route route = routeRepository.findById(dto.routeId)
            .orElseThrow(() -> new IllegalArgumentException("Route not found"));
        if (!bus.getCollege().getId().equals(route.getCollege().getId())) {
            throw new IllegalArgumentException("Bus and route must belong to the same college");
        }
        assignment.setBus(bus);
        assignment.setRoute(route);
        assignment.setValidFrom(dto.validFrom);
        assignment.setValidTo(dto.validTo);
        return busRouteAssignmentRepository.save(assignment);
    }

    public InchargeAssignment createInchargeAssignment(InchargeAssignmentDTO dto) {
        if (inchargeAssignmentRepository.hasOverlappingUserAssignment(dto.userId, dto.validFrom, dto.validTo)) {
            throw new IllegalArgumentException("Overlapping assignment for user");
        }
        if (inchargeAssignmentRepository.hasOverlappingBusAssignment(dto.busId, dto.validFrom, dto.validTo)) {
            throw new IllegalArgumentException("Overlapping assignment for bus");
        }
        InchargeAssignment assignment = new InchargeAssignment();
        assignment.setId(dto.id != null ? dto.id : UUID.randomUUID().toString());
        assignment.setUser(entityManager.getReference(User.class, dto.userId));
        assignment.setBus(entityManager.getReference(Bus.class, dto.busId));
        assignment.setValidFrom(dto.validFrom);
        assignment.setValidTo(dto.validTo);
        return inchargeAssignmentRepository.save(assignment);
    }

    public StudentEnrolment enrolStudent(StudentEnrolmentDTO dto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        boolean administrator = authentication.getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals("ROLE_ADMIN"));
        String studentId = administrator ? dto.studentId : authentication.getName();
        User student = entityManager.find(User.class, studentId);
        
        String busId = dto.busId;
        if (busId == null) {
            List<Bus> activeBuses = busRouteAssignmentRepository.findActiveBusesForRoute(dto.routeId, java.time.LocalDate.now());
            if (activeBuses.isEmpty()) throw new IllegalArgumentException("No active bus for this route");
            busId = activeBuses.get(0).getId();
        }
        
        Bus bus = busRepository.findById(busId)
                .orElseThrow(() -> new IllegalArgumentException("Bus not found"));
        Stop stop = stopRepository.findById(dto.selectedStopId)
                .orElseThrow(() -> new IllegalArgumentException("Stop not found"));
        if (student == null || !student.getCollege().getId().equals(bus.getCollege().getId())
                || !bus.getCollege().getId().equals(stop.getCollege().getId())) {
            throw new IllegalArgumentException("Student, bus, and stop must belong to the same college");
        }
        if (!routeStopRepository.existsByRouteIdAndStopId(dto.routeId, dto.selectedStopId)) {
            throw new IllegalArgumentException("Stop is not on the selected route");
        }
        if (studentEnrolmentRepository.existsByStudentIdAndStatus(studentId, "ACTIVE")) {
            throw new IllegalArgumentException("Student already has an active bus enrolment");
        }
        if (!busRouteAssignmentRepository.hasActiveAssignment(dto.busId, dto.routeId, java.time.LocalDate.now())) {
            throw new IllegalArgumentException("Bus is not assigned to the selected route");
        }
        StudentEnrolment enrolment = new StudentEnrolment();
        enrolment.setId(UUID.randomUUID().toString());
        enrolment.setStudent(student);
        enrolment.setBus(bus);
        enrolment.setSelectedStop(stop);
        enrolment.setStatus("ACTIVE");
        return studentEnrolmentRepository.save(enrolment);
    }
}
