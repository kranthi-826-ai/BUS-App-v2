package com.smartbus.trip.dto;

import lombok.Data;
import java.time.Instant;

@Data
public class LocationResponse {
    private String tripId;
    private String busId;
    private Double latitude;
    private Double longitude;
    private Double accuracy;
    private Double speed;
    private Double heading;
    private Instant capturedTime;
    private boolean stale;
}
