package com.smartbus.trip.service;

import com.smartbus.common.entity.User;
import com.smartbus.common.repository.UserRepository;
import com.smartbus.transport.entity.Bus;
import com.smartbus.transport.entity.Route;
import com.smartbus.transport.repository.BusRepository;
import com.smartbus.transport.repository.RouteRepository;
import com.smartbus.transport.repository.InchargeAssignmentRepository;
import com.smartbus.trip.dto.*;
import com.smartbus.trip.entity.*;
import com.smartbus.trip.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TripService {
    private final TripRepository tripRepository;
    private final LocationPointRepository locationPointRepository;
    private final LatestBusLocationRepository latestBusLocationRepository;
    private final BusRepository busRepository;
    private final RouteRepository routeRepository;
    private final InchargeAssignmentRepository inchargeAssignmentRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Transactional
    public TripResponse startTrip(StartTripRequest request, String userId) {
        // Ensure no active trip for the bus
        Optional<Trip> activeTrip = tripRepository.findByBusIdAndStatus(request.getBusId(), TripStatus.ACTIVE);
        if (activeTrip.isPresent()) {
            throw new IllegalArgumentException("Bus already has an active trip");
        }

        Bus bus = busRepository.findById(request.getBusId())
                .orElseThrow(() -> new IllegalArgumentException("Bus not found"));
        Route route = routeRepository.findById(request.getRouteId())
                .orElseThrow(() -> new IllegalArgumentException("Route not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (!inchargeAssignmentRepository.isAssignedToBusOnDate(
            userId, request.getBusId(), java.time.LocalDate.now())) {
            throw new IllegalArgumentException("In-charge is not assigned to this bus");
        }

        Trip trip = new Trip();
        trip.setBus(bus);
        trip.setRoute(route);
        trip.setIncharge(user);
        trip.setStatus(TripStatus.ACTIVE);
        trip.setStartedAt(Instant.now());

        trip = tripRepository.save(trip);
        return mapToTripResponse(trip);
    }

    @Transactional
    public TripResponse endTrip(String tripId, String userId) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new IllegalArgumentException("Trip not found"));
        
        if (trip.getStatus() != TripStatus.ACTIVE) {
            throw new IllegalArgumentException("Trip is not active");
        }

        if (!userId.equals(trip.getIncharge().getId())) {
            throw new IllegalArgumentException("Only the trip's in-charge can end the trip");
        }

        if (!inchargeAssignmentRepository.isAssignedToBusOnDate(
                trip.getIncharge().getId(), trip.getBus().getId(), java.time.LocalDate.now())) {
            throw new IllegalArgumentException("In-charge is not assigned to this bus");
        }
        
        trip.setStatus(TripStatus.ENDED);
        trip.setEndedAt(Instant.now());
        trip = tripRepository.save(trip);
        return mapToTripResponse(trip);
    }

    @Transactional
    public void submitLocations(String tripId, LocationBatchRequest request) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new IllegalArgumentException("Trip not found"));

        if (trip.getStatus() != TripStatus.ACTIVE) {
            throw new IllegalArgumentException("Trip is not active");
        }

        Instant now = Instant.now();
        Instant futureThreshold = now.plus(5, ChronoUnit.MINUTES);
        Instant pastThreshold = now.minus(24, ChronoUnit.HOURS);

        LatestBusLocation latestLoc = latestBusLocationRepository.findById(tripId).orElse(null);

        for (LocationPointDto ptDto : request.getPoints()) {
            // Validate time bounds
            if (ptDto.getCapturedTime().isAfter(futureThreshold) || ptDto.getCapturedTime().isBefore(pastThreshold)) {
                continue; // completely implausible or future
            }

            // Plausibility for lat/lon
            if (ptDto.getLatitude() < -90 || ptDto.getLatitude() > 90 || ptDto.getLongitude() < -180 || ptDto.getLongitude() > 180) {
                continue;
            }

            // Check duplicate
            if (locationPointRepository.existsByTripIdAndDeviceIdAndSequenceNum(tripId, request.getDeviceId(), ptDto.getSequenceNum())) {
                continue;
            }

            LocationPoint pt = new LocationPoint();
            pt.setTrip(trip);
            pt.setDeviceId(request.getDeviceId());
            pt.setSequenceNum(ptDto.getSequenceNum());
            pt.setCapturedTime(ptDto.getCapturedTime());
            pt.setReceivedTime(now);
            pt.setLatitude(ptDto.getLatitude());
            pt.setLongitude(ptDto.getLongitude());
            pt.setAccuracy(ptDto.getAccuracy());
            pt.setSpeed(ptDto.getSpeed());
            pt.setHeading(ptDto.getHeading());
            
            locationPointRepository.save(pt);

            // Update latest location if newer
            if (latestLoc == null || ptDto.getCapturedTime().isAfter(latestLoc.getCapturedTime())) {
                if (latestLoc == null) {
                    latestLoc = new LatestBusLocation();
                    latestLoc.setId(trip.getId());
                    latestLoc.setBusId(trip.getBus().getId());
                }
                latestLoc.setCapturedTime(ptDto.getCapturedTime());
                latestLoc.setReceivedTime(now);
                latestLoc.setLatitude(ptDto.getLatitude());
                latestLoc.setLongitude(ptDto.getLongitude());
                latestLoc.setAccuracy(ptDto.getAccuracy());
                latestLoc.setSpeed(ptDto.getSpeed());
                latestLoc.setHeading(ptDto.getHeading());
            }
        }

        if (latestLoc != null) {
            latestBusLocationRepository.save(latestLoc);
            
            LocationResponse res = new LocationResponse();
            res.setTripId(trip.getId());
            res.setBusId(trip.getBus().getId());
            res.setLatitude(latestLoc.getLatitude());
            res.setLongitude(latestLoc.getLongitude());
            res.setAccuracy(latestLoc.getAccuracy());
            res.setSpeed(latestLoc.getSpeed());
            res.setHeading(latestLoc.getHeading());
            res.setCapturedTime(latestLoc.getCapturedTime());

            messagingTemplate.convertAndSend("/topic/trips/" + tripId, res);
        }
    }

    public LocationResponse getLatestLocation(String tripId) {
        LatestBusLocation latestLoc = latestBusLocationRepository.findById(tripId)
                .orElseThrow(() -> new IllegalArgumentException("Latest location not found"));

        LocationResponse res = new LocationResponse();
        res.setTripId(latestLoc.getId());
        res.setBusId(latestLoc.getBusId());
        res.setLatitude(latestLoc.getLatitude());
        res.setLongitude(latestLoc.getLongitude());
        res.setAccuracy(latestLoc.getAccuracy());
        res.setSpeed(latestLoc.getSpeed());
        res.setHeading(latestLoc.getHeading());
        res.setCapturedTime(latestLoc.getCapturedTime());
        res.setStale(latestLoc.getCapturedTime().isBefore(Instant.now().minus(45, ChronoUnit.SECONDS)));
        return res;
    }

    public List<TripResponse> getActiveTrips() {
        return tripRepository.findByStatus(TripStatus.ACTIVE).stream()
                .map(this::mapToTripResponse)
                .toList();
    }

    private TripResponse mapToTripResponse(Trip trip) {
        TripResponse res = new TripResponse();
        res.setId(trip.getId());
        res.setBusId(trip.getBus().getId());
        res.setRouteId(trip.getRoute().getId());
        res.setInchargeId(trip.getIncharge().getId());
        res.setStatus(trip.getStatus().name());
        res.setStartedAt(trip.getStartedAt());
        res.setEndedAt(trip.getEndedAt());
        return res;
    }
}
