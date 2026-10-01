package com.smartbus.trip.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.Instant;
import org.hibernate.annotations.GenericGenerator;

@Data
@Entity
@Table(name = "location_points")
public class LocationPoint {
    @Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "uuid2")
    @Column(length = 36)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trip_id", nullable = false)
    private Trip trip;

    @Column(nullable = false, length = 100)
    private String deviceId;

    @Column(nullable = false)
    private Long sequenceNum;

    @Column(nullable = false)
    private Instant capturedTime;

    @Column(nullable = false)
    private Instant receivedTime = Instant.now();

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    private Double accuracy;
    private Double speed;
    private Double heading;
}
