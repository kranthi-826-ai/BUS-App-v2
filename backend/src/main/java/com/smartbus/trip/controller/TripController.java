package com.smartbus.trip.controller;

import com.smartbus.trip.dto.*;
import com.smartbus.trip.service.TripService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;

@RestController
@RequestMapping("/api/v1/trips")
@RequiredArgsConstructor
public class TripController {
    private final TripService tripService;

    @PostMapping
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<TripResponse> startTrip(@Valid @RequestBody StartTripRequest request, Principal principal) {
        TripResponse res = tripService.startTrip(request, principal.getName());
        return ResponseEntity.ok(res);
    }

    @PostMapping("/{tripId}/end")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<TripResponse> endTrip(@PathVariable String tripId) {
        TripResponse res = tripService.endTrip(tripId);
        return ResponseEntity.ok(res);
    }

    @PostMapping("/{tripId}/locations")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<Void> submitLocations(@PathVariable String tripId, @Valid @RequestBody LocationBatchRequest request) {
        tripService.submitLocations(tripId, request);
        return ResponseEntity.accepted().build();
    }

    @GetMapping("/{tripId}/locations/latest")
    public ResponseEntity<LocationResponse> getLatestLocation(@PathVariable String tripId) {
        LocationResponse res = tripService.getLatestLocation(tripId);
        return ResponseEntity.ok(res);
    }
}
