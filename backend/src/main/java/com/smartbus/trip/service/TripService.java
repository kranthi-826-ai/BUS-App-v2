package com.smartbus.trip.service;

import com.smartbus.common.entity.User;
import com.smartbus.common.repository.UserRepository;
import com.smartbus.transport.entity.Bus;
import com.smartbus.transport.entity.Route;
import com.smartbus.transport.repository.BusRepository;
import com.smartbus.transport.repository.InchargeAssignmentRepository;
import com.smartbus.transport.repository.RouteRepository;
import com.smartbus.transport.repository.StudentEnrolmentRepository;
import com.smartbus.trip.dto.LocationBatchRequest;
import com.smartbus.trip.dto.LocationPointDto;
import com.smartbus.trip.dto.LocationResponse;
import com.smartbus.trip.dto.StartTripRequest;
import com.smartbus.trip.dto.TripResponse;
import com.smartbus.trip.entity.LatestBusLocation;
import com.smartbus.trip.entity.LocationPoint;
import com.smartbus.trip.entity.Trip;
import com.smartbus.trip.entity.TripStatus;
import com.smartbus.trip.repository.LatestBusLocationRepository;
import com.smartbus.trip.repository.LocationPointRepository;
import com.smartbus.trip.repository.TripRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TripService {
    private static final long LOCATION_STALE_SECONDS = 45;
    private static final int MAX_LOCATION_BATCH_SIZE = 100;

    private final TripRepository tripRepository;
    private final LocationPointRepository locationPointRepository;
    private final LatestBusLocationRepository latestBusLocationRepository;
    private final BusRepository busRepository;
    private final RouteRepository routeRepository;
    private final InchargeAssignmentRepository inchargeAssignmentRepository;
    private final StudentEnrolmentRepository studentEnrolmentRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Transactional
    public TripResponse startTrip(StartTripRequest request, String userId) {
        Optional<Trip> activeTrip = tripRepository.findByBusIdAndStatus(request.getBusId(), TripStatus.ACTIVE);
        Optional<Trip> pausedTrip = tripRepository.findByBusIdAndStatus(request.getBusId(), TripStatus.PAUSED);
        if (activeTrip.isPresent() || pausedTrip.isPresent()) {
            throw new IllegalArgumentException("Bus already has an active trip");
        }

        Bus bus = busRepository.findById(request.getBusId())
                .orElseThrow(() -> new IllegalArgumentException("Bus not found"));
        Route route = routeRepository.findById(request.getRouteId())
                .orElseThrow(() -> new IllegalArgumentException("Route not found"));
        if (!route.getCollege().getId().equals(bus.getCollege().getId())) {
            throw new IllegalArgumentException("Route and bus must belong to the same college");
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        requireAssignment(userId, request.getBusId());

        Trip trip = new Trip();
        trip.setId(java.util.UUID.randomUUID().toString());
        trip.setBus(bus);
        trip.setRoute(route);
        trip.setIncharge(user);
        trip.setStatus(TripStatus.ACTIVE);
        trip.setStartedAt(Instant.now());
        return mapToTripResponse(tripRepository.save(trip));
    }

    @Transactional
    public TripResponse pauseTrip(String tripId, String userId, boolean administrator) {
        Trip trip = findTrip(tripId);
        if (trip.getStatus() != TripStatus.ACTIVE) {
            throw new IllegalArgumentException("Trip is not active");
        }
        requireTripController(trip, userId, administrator);
        trip.setStatus(TripStatus.PAUSED);
        return mapToTripResponse(tripRepository.save(trip));
    }

    @Transactional
    public TripResponse resumeTrip(String tripId, String userId, boolean administrator) {
        Trip trip = findTrip(tripId);
        if (trip.getStatus() != TripStatus.PAUSED) {
            throw new IllegalArgumentException("Trip is not paused");
        }
        requireTripController(trip, userId, administrator);
        trip.setStatus(TripStatus.ACTIVE);
        return mapToTripResponse(tripRepository.save(trip));
    }

    @Transactional
    public TripResponse endTrip(String tripId, String userId, boolean administrator) {
        Trip trip = findTrip(tripId);
        if (trip.getStatus() != TripStatus.ACTIVE && trip.getStatus() != TripStatus.PAUSED) {
            throw new IllegalArgumentException("Trip is not active");
        }
        requireTripController(trip, userId, administrator);
        trip.setStatus(TripStatus.ENDED);
        trip.setEndedAt(Instant.now());
        return mapToTripResponse(tripRepository.save(trip));
    }

    @Transactional
    public void submitLocations(String tripId, LocationBatchRequest request, String userId) {
        Trip trip = findTrip(tripId);
        if (trip.getStatus() != TripStatus.ACTIVE) {
            throw new IllegalArgumentException("Trip is not active");
        }
        requireTripController(trip, userId, false);
        if (request.getPoints().size() > MAX_LOCATION_BATCH_SIZE) {
            throw new IllegalArgumentException("Location batch exceeds the maximum size");
        }

        Instant now = Instant.now();
        Instant futureThreshold = now.plus(5, ChronoUnit.MINUTES);
        Instant pastThreshold = now.minus(24, ChronoUnit.HOURS);
        LatestBusLocation latestLocation = latestBusLocationRepository.findById(tripId).orElse(null);

        for (LocationPointDto pointDto : request.getPoints()) {
            if (pointDto.getCapturedTime().isAfter(futureThreshold) || pointDto.getCapturedTime().isBefore(pastThreshold)) {
                continue;
            }
            if (pointDto.getLatitude() < -90 || pointDto.getLatitude() > 90
                    || pointDto.getLongitude() < -180 || pointDto.getLongitude() > 180) {
                continue;
            }
            if (pointDto.getAccuracy() != null && (pointDto.getAccuracy() < 0 || pointDto.getAccuracy() > 100)) {
                continue;
            }
            if (pointDto.getSpeed() != null && (pointDto.getSpeed() < 0 || pointDto.getSpeed() > 80)) {
                continue;
            }
            if (pointDto.getHeading() != null && (pointDto.getHeading() < 0 || pointDto.getHeading() >= 360)) {
                continue;
            }
            if (locationPointRepository.existsByTripIdAndDeviceIdAndSequenceNum(
                    tripId, request.getDeviceId(), pointDto.getSequenceNum())) {
                continue;
            }

            LocationPoint locationPoint = new LocationPoint();
            locationPoint.setTrip(trip);
            locationPoint.setDeviceId(request.getDeviceId());
            locationPoint.setSequenceNum(pointDto.getSequenceNum());
            locationPoint.setCapturedTime(pointDto.getCapturedTime());
            locationPoint.setReceivedTime(now);
            locationPoint.setLatitude(pointDto.getLatitude());
            locationPoint.setLongitude(pointDto.getLongitude());
            locationPoint.setAccuracy(pointDto.getAccuracy());
            locationPoint.setSpeed(pointDto.getSpeed());
            locationPoint.setHeading(pointDto.getHeading());
            locationPointRepository.save(locationPoint);

            if (latestLocation == null || pointDto.getCapturedTime().isAfter(latestLocation.getCapturedTime())) {
                if (latestLocation == null) {
                    latestLocation = new LatestBusLocation();
                    latestLocation.setId(trip.getId());
                    latestLocation.setBusId(trip.getBus().getId());
                }
                latestLocation.setCapturedTime(pointDto.getCapturedTime());
                latestLocation.setReceivedTime(now);
                latestLocation.setLatitude(pointDto.getLatitude());
                latestLocation.setLongitude(pointDto.getLongitude());
                latestLocation.setAccuracy(pointDto.getAccuracy());
                latestLocation.setSpeed(pointDto.getSpeed());
                latestLocation.setHeading(pointDto.getHeading());
            }
        }

        if (latestLocation != null) {
            latestBusLocationRepository.save(latestLocation);
            LocationResponse response = mapToLocationResponse(latestLocation);
            messagingTemplate.convertAndSend("/topic/trips/" + tripId, response);
        }
    }

    @Transactional(readOnly = true)
    public LocationResponse getLatestLocation(String tripId, String userId, String role) {
        Trip trip = findTrip(tripId);
        boolean administrator = "ROLE_ADMIN".equals(role);
        boolean assignedIncharge = trip.getIncharge().getId().equals(userId);
        boolean enrolledStudent = studentEnrolmentRepository.existsByStudentIdAndBusIdAndStatus(
                userId, trip.getBus().getId(), "ACTIVE");
        if (!administrator && !assignedIncharge && !enrolledStudent) {
            throw new IllegalArgumentException("User is not enrolled in or assigned to this bus");
        }

        LatestBusLocation latestLocation = latestBusLocationRepository.findById(tripId)
                .orElseThrow(() -> new IllegalArgumentException("Latest location not found"));
        return mapToLocationResponse(latestLocation);
    }

    @Transactional(readOnly = true)
    public List<TripResponse> getActiveTrips(String userId, String role) {
        boolean administrator = "ROLE_ADMIN".equals(role);
        return tripRepository.findByStatus(TripStatus.ACTIVE).stream()
                .filter(trip -> administrator
                        || trip.getIncharge().getId().equals(userId)
                        || studentEnrolmentRepository.existsByStudentIdAndBusIdAndStatus(
                                userId, trip.getBus().getId(), "ACTIVE"))
                .map(this::mapToTripResponse)
                .toList();
    }

    private Trip findTrip(String tripId) {
        return tripRepository.findById(tripId)
                .orElseThrow(() -> new IllegalArgumentException("Trip not found"));
    }

    private void requireAssignment(String userId, String busId) {
        if (!inchargeAssignmentRepository.isAssignedToBusOnDate(userId, busId, LocalDate.now())) {
            throw new IllegalArgumentException("In-charge is not assigned to this bus");
        }
    }

    private void requireTripController(Trip trip, String userId, boolean administrator) {
        if (administrator) {
            return;
        }
        if (!userId.equals(trip.getIncharge().getId())) {
            throw new IllegalArgumentException("Only the trip's in-charge can control this trip");
        }
        requireAssignment(userId, trip.getBus().getId());
    }

    private LocationResponse mapToLocationResponse(LatestBusLocation location) {
        LocationResponse response = new LocationResponse();
        response.setTripId(location.getId());
        response.setBusId(location.getBusId());
        response.setLatitude(location.getLatitude());
        response.setLongitude(location.getLongitude());
        response.setAccuracy(location.getAccuracy());
        response.setSpeed(location.getSpeed());
        response.setHeading(location.getHeading());
        response.setCapturedTime(location.getCapturedTime());
        response.setStale(location.getCapturedTime().isBefore(Instant.now().minusSeconds(LOCATION_STALE_SECONDS)));
        return response;
    }

    private TripResponse mapToTripResponse(Trip trip) {
        TripResponse response = new TripResponse();
        response.setId(trip.getId());
        response.setBusId(trip.getBus().getId());
        response.setRouteId(trip.getRoute().getId());
        response.setInchargeId(trip.getIncharge().getId());
        response.setStatus(trip.getStatus().name());
        response.setStartedAt(trip.getStartedAt());
        response.setEndedAt(trip.getEndedAt());
        return response;
    }
}
