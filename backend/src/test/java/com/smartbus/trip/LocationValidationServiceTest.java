package com.smartbus.trip;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;
import java.time.Instant;
import org.junit.jupiter.api.Test;

class LocationValidationServiceTest {
    private final LocationValidationService service = new LocationValidationService();
    private final Instant now = Instant.parse("2026-10-07T10:00:00Z");

    @Test void acceptsFreshValidPoint() {
        assertDoesNotThrow(() -> service.validate(new LocationPoint(17.4,78.4,now.minusSeconds(5),12d,180d,8d), null, now));
    }
    @Test void rejectsInvalidCoordinates() {
        assertThrows(IllegalArgumentException.class, () -> service.validate(new LocationPoint(91,78.4,now,null,null,5d), null, now));
    }
    @Test void rejectsStalePoint() {
        assertThrows(IllegalArgumentException.class, () -> service.validate(new LocationPoint(17.4,78.4,now.minusSeconds(61),null,null,5d), null, now));
    }
    @Test void rejectsOutOfOrderPoint() {
        LocationPoint previous = new LocationPoint(17.4,78.4,now.minusSeconds(5),null,null,5d);
        assertThrows(IllegalArgumentException.class, () -> service.validate(new LocationPoint(17.4,78.4,now.minusSeconds(6),null,null,5d), previous, now));
    }
}
