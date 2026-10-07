package com.smartbus.integration;

import java.time.Instant;

public record ExternalLocation(
        String busId,
        double latitude,
        double longitude,
        Double accuracy,
        Double speed,
        Double heading,
        Instant capturedTime
) {}
