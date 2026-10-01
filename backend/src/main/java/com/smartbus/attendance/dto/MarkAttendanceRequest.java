package com.smartbus.attendance.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class MarkAttendanceRequest {

    @NotBlank(message = "Student ID is required")
    private String studentId;

    @NotBlank(message = "Status is required")
    @Pattern(regexp = "PRESENT|ABSENT", message = "Status must be PRESENT or ABSENT")
    private String status;

    public MarkAttendanceRequest() {}

    public MarkAttendanceRequest(String studentId, String status) {
        this.studentId = studentId;
        this.status = status;
    }

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
