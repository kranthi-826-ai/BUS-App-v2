package com.smartbus.transport.entity;
import com.smartbus.common.entity.College;
import jakarta.persistence.*;
import java.time.Instant;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Table(name = "routes")
public class Route {
    @Id private String id;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "college_id", nullable = false) private College college;
    @Column(nullable = false) private String name;
    @Column(nullable = false) private String direction;
    @Column(nullable = false) private Boolean active = true;
    @CreationTimestamp @Column(name = "created_at", nullable = false, updatable = false) private Instant createdAt;
    @UpdateTimestamp @Column(name = "updated_at", nullable = false) private Instant updatedAt;

    public String getId() { return id; } public void setId(String id) { this.id = id; }
    public College getCollege() { return college; } public void setCollege(College college) { this.college = college; }
    public String getName() { return name; } public void setName(String name) { this.name = name; }
    public String getDirection() { return direction; } public void setDirection(String direction) { this.direction = direction; }
    public Boolean getActive() { return active; } public void setActive(Boolean active) { this.active = active; }
    public Instant getCreatedAt() { return createdAt; } public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; } public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
