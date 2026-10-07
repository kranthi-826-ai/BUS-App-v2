package com.smartbus.trip;

import java.time.Duration;
import java.time.Instant;
import org.springframework.stereotype.Service;

@Service
public class LocationValidationService {
    public void validate(LocationPoint point, LocationPoint previous, Instant now) {
        if (point.latitude() < -90 || point.latitude() > 90 || point.longitude() < -180 || point.longitude() > 180) {
            throw new IllegalArgumentException("Coordinates are outside valid bounds");
        }
        if (point.capturedAt() == null || point.capturedAt().isAfter(now.plusSeconds(10))) {
            throw new IllegalArgumentException("Location timestamp is in the future");
        }
        if (point.accuracy() != null && (point.accuracy() < 0 || point.accuracy() > 100)) {
            throw new IllegalArgumentException("GPS accuracy is insufficient");
        }
        if (previous != null && !point.capturedAt().isAfter(previous.capturedAt())) {
            throw new IllegalArgumentException("Location points must be strictly ordered");
        }
        if (point.speed() != null && (point.speed() < 0 || point.speed() > 40)) {
            throw new IllegalArgumentException("Location speed is invalid or exceeds the safety limit");
        }
        if (Duration.between(point.capturedAt(), now).getSeconds() > 60) {
            throw new IllegalArgumentException("Location point is stale");
        }
    }
}
