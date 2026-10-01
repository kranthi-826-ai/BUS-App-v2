package com.smartbus.transport.entity;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "bus_route_assignments")
public class BusRouteAssignment {
    @Id private String id;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "bus_id", nullable = false) private Bus bus;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "route_id", nullable = false) private Route route;
    @Column(name = "valid_from", nullable = false) private LocalDate validFrom;
    @Column(name = "valid_to") private LocalDate validTo;

    public String getId() { return id; } public void setId(String id) { this.id = id; }
    public Bus getBus() { return bus; } public void setBus(Bus bus) { this.bus = bus; }
    public Route getRoute() { return route; } public void setRoute(Route route) { this.route = route; }
    public LocalDate getValidFrom() { return validFrom; } public void setValidFrom(LocalDate validFrom) { this.validFrom = validFrom; }
    public LocalDate getValidTo() { return validTo; } public void setValidTo(LocalDate validTo) { this.validTo = validTo; }
}
