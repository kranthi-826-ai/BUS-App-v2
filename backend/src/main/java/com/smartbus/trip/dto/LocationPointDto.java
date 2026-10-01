package com.smartbus.trip.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.Instant;

@Data
public class LocationPointDto {
    @NotNull(message = "Sequence number is required")
    private Long sequenceNum;

    @NotNull(message = "Captured time is required")
    private Instant capturedTime;

    @NotNull(message = "Latitude is required")
    private Double latitude;

    @NotNull(message = "Longitude is required")
    private Double longitude;

    private Double accuracy;
    private Double speed;
    private Double heading;
}
