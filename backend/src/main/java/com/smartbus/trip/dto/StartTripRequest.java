package com.smartbus.trip.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class StartTripRequest {
    @NotBlank(message = "Bus ID is required")
    private String busId;

    @NotBlank(message = "Route ID is required")
    private String routeId;
}
