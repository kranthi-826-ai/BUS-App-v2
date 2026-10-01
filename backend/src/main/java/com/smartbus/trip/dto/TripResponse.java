package com.smartbus.trip.dto;

import lombok.Data;
import java.time.Instant;

@Data
public class TripResponse {
    private String id;
    private String busId;
    private String routeId;
    private String inchargeId;
    private String status;
    private Instant startedAt;
    private Instant endedAt;
}
