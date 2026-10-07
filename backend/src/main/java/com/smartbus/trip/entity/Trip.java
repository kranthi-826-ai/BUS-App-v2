package com.smartbus.trip.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.AccessLevel;
import lombok.Getter;
import java.time.Instant;
import org.springframework.data.domain.Persistable;
import com.smartbus.transport.entity.Bus;
import com.smartbus.transport.entity.Route;
import com.smartbus.common.entity.User;

@Data
@Entity
@Table(name = "trips")
public class Trip implements Persistable<String> {
    @Id
    @Column(length = 36)
    private String id;

    @Transient
    @Getter(AccessLevel.NONE)
    private boolean isNew = true;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "bus_id", nullable = false)
    private Bus bus;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "route_id", nullable = false)
    private Route route;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "incharge_id", nullable = false)
    private User incharge;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TripStatus status = TripStatus.ACTIVE;

    @Column(nullable = false)
    private Instant startedAt = Instant.now();

    private Instant endedAt;

    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @Column(nullable = false)
    private Instant updatedAt = Instant.now();
    
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = Instant.now();
    }

    @Override
    public boolean isNew() {
        return isNew;
    }

    @PostPersist
    @PostLoad
    void markNotNew() {
        isNew = false;
    }
}
