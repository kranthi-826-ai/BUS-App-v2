package com.smartbus.attendance.controller;

import com.smartbus.attendance.dto.AttendanceRecordDto;
import com.smartbus.attendance.dto.MarkAttendanceRequest;
import com.smartbus.attendance.service.AttendanceService;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.util.List;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    private final AttendanceService attendanceService;

    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    @PostMapping("/trip/{tripId}/manual")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<AttendanceRecordDto> markManualAttendance(
            @PathVariable String tripId,
            @Valid @RequestBody MarkAttendanceRequest request,
            org.springframework.security.core.Authentication authentication
    ) {
        String userId = authentication.getName();
        AttendanceRecordDto record = attendanceService.markManualAttendance(
                tripId,
                request.getStudentId(),
                request.getStatus(),
                userId
        );
        return ResponseEntity.ok(record);
    }

    @GetMapping("/trip/{tripId}/export")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<byte[]> exportAttendanceCsv(@PathVariable String tripId) {
        List<AttendanceRecordDto> records = attendanceService.getAttendanceForTrip(tripId);
        
        StringBuilder csv = new StringBuilder();
        csv.append("id,trip_id,student_id,status,source,marked_by,timestamp\n");
        for (AttendanceRecordDto record : records) {
            csv.append(record.getId()).append(",")
               .append(record.getTripId()).append(",")
               .append(record.getStudentId()).append(",")
               .append(record.getStatus()).append(",")
               .append(record.getSource()).append(",")
               .append(record.getMarkedBy()).append(",")
               .append(record.getTimestamp()).append("\n");
        }

        byte[] csvBytes = csv.toString().getBytes(StandardCharsets.UTF_8);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("text/csv"));
        headers.setContentDispositionFormData("attachment", "attendance_trip_" + tripId + ".csv");

        return ResponseEntity.ok()
                .headers(headers)
                .body(csvBytes);
    }
}
