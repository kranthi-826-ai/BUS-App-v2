package com.smartbus.transport.service;

import com.smartbus.transport.entity.*;
import com.smartbus.transport.repository.*;
import com.smartbus.transport.dto.DTOs.*;
import com.smartbus.common.entity.College;
import com.smartbus.common.entity.User;
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

    public RouteStop createRouteStop(RouteStopDTO dto) {
        RouteStop rs = new RouteStop();
        rs.setId(dto.id != null ? dto.id : UUID.randomUUID().toString());
        rs.setRoute(entityManager.getReference(Route.class, dto.routeId));
        rs.setStop(entityManager.getReference(Stop.class, dto.stopId));
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
        assignment.setBus(entityManager.getReference(Bus.class, dto.busId));
        assignment.setRoute(entityManager.getReference(Route.class, dto.routeId));
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
        StudentEnrolment enrolment = new StudentEnrolment();
        enrolment.setId(dto.id != null ? dto.id : UUID.randomUUID().toString());
        enrolment.setStudent(entityManager.getReference(User.class, dto.studentId));
        enrolment.setBus(entityManager.getReference(Bus.class, dto.busId));
        enrolment.setSelectedStop(entityManager.getReference(Stop.class, dto.selectedStopId));
        enrolment.setStatus(dto.status != null ? dto.status : "ACTIVE");
        return studentEnrolmentRepository.save(enrolment);
    }
}
