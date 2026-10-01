package com.smartbus.transport.entity;
import com.smartbus.common.entity.User;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "incharge_assignments")
public class InchargeAssignment {
    @Id private String id;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "user_id", nullable = false) private User user;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "bus_id", nullable = false) private Bus bus;
    @Column(name = "valid_from", nullable = false) private LocalDate validFrom;
    @Column(name = "valid_to") private LocalDate validTo;

    public String getId() { return id; } public void setId(String id) { this.id = id; }
    public User getUser() { return user; } public void setUser(User user) { this.user = user; }
    public Bus getBus() { return bus; } public void setBus(Bus bus) { this.bus = bus; }
    public LocalDate getValidFrom() { return validFrom; } public void setValidFrom(LocalDate validFrom) { this.validFrom = validFrom; }
    public LocalDate getValidTo() { return validTo; } public void setValidTo(LocalDate validTo) { this.validTo = validTo; }
}
