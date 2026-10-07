package com.smartbus.trip.controller;

import com.smartbus.trip.dto.*;
import com.smartbus.trip.service.TripService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;

@RestController
@RequestMapping("/api/v1/trips")
@RequiredArgsConstructor
public class TripController {
    private final TripService tripService;

    @GetMapping("/active")
    @PreAuthorize("hasAnyRole('STUDENT', 'STAFF', 'ADMIN')")
    public ResponseEntity<java.util.List<TripResponse>> getActiveTrips(Principal principal, Authentication authentication) {
        String role = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .filter(authority -> authority.startsWith("ROLE_"))
                .findFirst().orElse("");
        return ResponseEntity.ok(tripService.getActiveTrips(principal.getName(), role));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<TripResponse> startTrip(@Valid @RequestBody StartTripRequest request, Principal principal) {
        TripResponse res = tripService.startTrip(request, principal.getName());
        return ResponseEntity.ok(res);
    }

    @PostMapping("/{tripId}/pause")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<TripResponse> pauseTrip(@PathVariable String tripId, Principal principal, Authentication authentication) {
        boolean administrator = authentication.getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals("ROLE_ADMIN"));
        return ResponseEntity.ok(tripService.pauseTrip(tripId, principal.getName(), administrator));
    }

    @PostMapping("/{tripId}/resume")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<TripResponse> resumeTrip(@PathVariable String tripId, Principal principal, Authentication authentication) {
        boolean administrator = authentication.getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals("ROLE_ADMIN"));
        return ResponseEntity.ok(tripService.resumeTrip(tripId, principal.getName(), administrator));
    }

    @PostMapping("/{tripId}/end")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<TripResponse> endTrip(@PathVariable String tripId, Principal principal, Authentication authentication) {
        boolean administrator = authentication.getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals("ROLE_ADMIN"));
        TripResponse res = tripService.endTrip(tripId, principal.getName(), administrator);
        return ResponseEntity.ok(res);
    }

    @PostMapping("/{tripId}/locations")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<Void> submitLocations(@PathVariable String tripId, @Valid @RequestBody LocationBatchRequest request, Principal principal) {
        tripService.submitLocations(tripId, request, principal.getName());
        return ResponseEntity.accepted().build();
    }

    @GetMapping("/{tripId}/locations/latest")
    @PreAuthorize("hasAnyRole('STUDENT', 'STAFF', 'ADMIN')")
    public ResponseEntity<LocationResponse> getLatestLocation(@PathVariable String tripId, Principal principal, Authentication authentication) {
        String role = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .filter(authority -> authority.startsWith("ROLE_"))
                .findFirst().orElse("");
        LocationResponse res = tripService.getLatestLocation(tripId, principal.getName(), role);
        return ResponseEntity.ok(res);
    }
}
