package com.smartbus.attendance.dto;

import java.time.Instant;

public class AttendanceRecordDto {
    private String id;
    private String tripId;
    private String studentId;
    private String status;
    private String source;
    private String markedBy;
    private Instant timestamp;

    public AttendanceRecordDto() {}

    public AttendanceRecordDto(String id, String tripId, String studentId, String status, String source, String markedBy, Instant timestamp) {
        this.id = id;
        this.tripId = tripId;
        this.studentId = studentId;
        this.status = status;
        this.source = source;
        this.markedBy = markedBy;
        this.timestamp = timestamp;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTripId() { return tripId; }
    public void setTripId(String tripId) { this.tripId = tripId; }
    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }
    public String getMarkedBy() { return markedBy; }
    public void setMarkedBy(String markedBy) { this.markedBy = markedBy; }
    public Instant getTimestamp() { return timestamp; }
    public void setTimestamp(Instant timestamp) { this.timestamp = timestamp; }
}
