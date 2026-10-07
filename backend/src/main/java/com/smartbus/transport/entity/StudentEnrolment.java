package com.smartbus.transport.entity;
import com.smartbus.common.entity.User;
import jakarta.persistence.*;
import java.time.Instant;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Table(name = "student_enrolments")
public class StudentEnrolment {
    @Id private String id;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "student_id", nullable = false) private User student;
    @ManyToOne(fetch = FetchType.EAGER) @JoinColumn(name = "bus_id", nullable = false) private Bus bus;
    @ManyToOne(fetch = FetchType.EAGER) @JoinColumn(name = "selected_stop_id", nullable = false) private Stop selectedStop;
    @Column(nullable = false) private String status = "ACTIVE";
    @CreationTimestamp @Column(name = "created_at", nullable = false, updatable = false) private Instant createdAt;
    @UpdateTimestamp @Column(name = "updated_at", nullable = false) private Instant updatedAt;

    public String getId() { return id; } public void setId(String id) { this.id = id; }
    public User getStudent() { return student; } public void setStudent(User student) { this.student = student; }
    public Bus getBus() { return bus; } public void setBus(Bus bus) { this.bus = bus; }
    public Stop getSelectedStop() { return selectedStop; } public void setSelectedStop(Stop selectedStop) { this.selectedStop = selectedStop; }
    public String getStatus() { return status; } public void setStatus(String status) { this.status = status; }
    public Instant getCreatedAt() { return createdAt; } public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; } public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
