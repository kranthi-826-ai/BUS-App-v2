package com.smartbus.trip;

import java.time.Instant;

public record LocationPoint(double latitude, double longitude, Instant capturedAt, Double speed, Double heading, Double accuracy) {}
