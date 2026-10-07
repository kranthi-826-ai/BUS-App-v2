package com.smartbus.transport.entity;
import jakarta.persistence.*;

@Entity
@Table(name = "route_stops")
public class RouteStop {
    @Id private String id;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "route_id", nullable = false) private Route route;
    @ManyToOne(fetch = FetchType.EAGER) @JoinColumn(name = "stop_id", nullable = false) private Stop stop;
    @Column(name = "sequence_num", nullable = false) private Integer sequenceNum;
    @Column(name = "scheduled_offset_mins") private Integer scheduledOffsetMins;

    public String getId() { return id; } public void setId(String id) { this.id = id; }
    public Route getRoute() { return route; } public void setRoute(Route route) { this.route = route; }
    public Stop getStop() { return stop; } public void setStop(Stop stop) { this.stop = stop; }
    public Integer getSequenceNum() { return sequenceNum; } public void setSequenceNum(Integer sequenceNum) { this.sequenceNum = sequenceNum; }
    public Integer getScheduledOffsetMins() { return scheduledOffsetMins; } public void setScheduledOffsetMins(Integer scheduledOffsetMins) { this.scheduledOffsetMins = scheduledOffsetMins; }
}
