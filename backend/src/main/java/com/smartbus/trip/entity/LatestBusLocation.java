package com.smartbus.trip.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.Instant;
import com.smartbus.transport.entity.Bus;

@Data
@Entity
@Table(name = "latest_bus_locations")
public class LatestBusLocation {
    @Id
    @Column(name = "trip_id", length = 36)
    private String id;

    @Column(name = "bus_id", nullable = false, length = 36)
    private String busId;

    @Column(nullable = false)
    private Instant capturedTime;

    @Column(nullable = false)
    private Instant receivedTime;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    private Double accuracy;
    private Double speed;
    private Double heading;
}
