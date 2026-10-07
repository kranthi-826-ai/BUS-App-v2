package com.smartbus.transport.controller;

import com.smartbus.transport.service.TransportService;
import com.smartbus.transport.dto.DTOs.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/transport")
public class TransportController {
    private final TransportService transportService;

    public TransportController(TransportService transportService) {
        this.transportService = transportService;
    }

    @PostMapping("/buses")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createBus(@RequestBody BusDTO dto) {
        return ResponseEntity.ok(transportService.createBus(dto));
    }

    @GetMapping("/buses")
    @PreAuthorize("hasAnyRole('ADMIN', 'STUDENT')")
    public ResponseEntity<?> getBuses() {
        return ResponseEntity.ok(transportService.getBusesForCurrentUser());
    }

    @GetMapping("/routes/{routeId}/buses")
    @PreAuthorize("hasAnyRole('ADMIN', 'STUDENT')")
    public ResponseEntity<?> getBusesForRoute(@PathVariable String routeId) {
        return ResponseEntity.ok(transportService.getBusesForRoute(routeId));
    }

    @GetMapping("/enrolments/me")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> getMyEnrolment() {
        return ResponseEntity.ok(transportService.getCurrentStudentEnrolment());
    }

    @PostMapping("/routes")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createRoute(@RequestBody RouteDTO dto) {
        return ResponseEntity.ok(transportService.createRoute(dto));
    }

    @GetMapping("/routes")
    @PreAuthorize("hasAnyRole('ADMIN', 'STUDENT')")
    public ResponseEntity<?> getRoutes() {
        return ResponseEntity.ok(transportService.getRoutesForCurrentUser());
    }

    @PostMapping("/stops")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createStop(@RequestBody StopDTO dto) {
        return ResponseEntity.ok(transportService.createStop(dto));
    }

    @GetMapping("/routes/{routeId}/stops")
    @PreAuthorize("hasAnyRole('ADMIN', 'STUDENT')")
    public ResponseEntity<?> getStopsForRoute(@PathVariable String routeId) {
        transportService.requireRouteVisibleToCurrentUser(routeId);
        return ResponseEntity.ok(transportService.getStopsForRoute(routeId));
    }

    @PostMapping("/route-stops")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createRouteStop(@RequestBody RouteStopDTO dto) {
        return ResponseEntity.ok(transportService.createRouteStop(dto));
    }

    @PostMapping("/bus-route-assignments")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createBusRouteAssignment(@RequestBody BusRouteAssignmentDTO dto) {
        return ResponseEntity.ok(transportService.createBusRouteAssignment(dto));
    }

    @PostMapping("/incharge-assignments")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createInchargeAssignment(@RequestBody InchargeAssignmentDTO dto) {
        return ResponseEntity.ok(transportService.createInchargeAssignment(dto));
    }

    @PostMapping("/enrolments")
    @PreAuthorize("hasRole('STUDENT') or hasRole('ADMIN')")
    public ResponseEntity<?> enrolStudent(@RequestBody StudentEnrolmentDTO dto) {
        return ResponseEntity.status(201).body(transportService.enrolStudent(dto));
    }
}
