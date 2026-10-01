package com.smartbus.trip.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;
import java.util.List;

@Data
public class LocationBatchRequest {
    @NotBlank(message = "Device ID is required")
    private String deviceId;

    @NotEmpty(message = "Points list cannot be empty")
    @Valid
    private List<LocationPointDto> points;
}
