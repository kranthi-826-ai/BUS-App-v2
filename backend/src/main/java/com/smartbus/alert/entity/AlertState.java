package com.smartbus.alert.entity;

import com.smartbus.trip.entity.Trip;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "alert_states")
public class AlertState {

    @Id
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subscription_id", nullable = false)
    private AlertSubscription subscription;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trip_id", nullable = false)
    private Trip trip;

    @Column(nullable = false)
    private String state; // OUTSIDE, APPROACHING, NOTIFIED

    @Column(name = "last_distance_meters")
    private Double lastDistanceMeters;

    @Column(name = "notified_at")
    private LocalDateTime notifiedAt;

    @Column(name = "rearmed_at")
    private LocalDateTime rearmedAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public AlertState() {}

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Getters and setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public AlertSubscription getSubscription() { return subscription; }
    public void setSubscription(AlertSubscription subscription) { this.subscription = subscription; }
    public Trip getTrip() { return trip; }
    public void setTrip(Trip trip) { this.trip = trip; }
    public String getState() { return state; }
    public void setState(String state) { this.state = state; }
    public Double getLastDistanceMeters() { return lastDistanceMeters; }
    public void setLastDistanceMeters(Double lastDistanceMeters) { this.lastDistanceMeters = lastDistanceMeters; }
    public LocalDateTime getNotifiedAt() { return notifiedAt; }
    public void setNotifiedAt(LocalDateTime notifiedAt) { this.notifiedAt = notifiedAt; }
    public LocalDateTime getRearmedAt() { return rearmedAt; }
    public void setRearmedAt(LocalDateTime rearmedAt) { this.rearmedAt = rearmedAt; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
