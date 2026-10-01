package com.smartbus.attendance.service;

import com.smartbus.attendance.dto.AttendanceRecordDto;
import com.smartbus.attendance.entity.AttendanceRecord;
import com.smartbus.attendance.repository.AttendanceRecordRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AttendanceService {

    private final AttendanceRecordRepository attendanceRepository;

    public AttendanceService(AttendanceRecordRepository attendanceRepository) {
        this.attendanceRepository = attendanceRepository;
    }

    @Transactional
    public AttendanceRecordDto markManualAttendance(String tripId, String studentId, String status, String markedByUserId) {
        try {
            AttendanceRecord record = new AttendanceRecord(
                    tripId,
                    studentId,
                    status,
                    "MANUAL",
                    markedByUserId,
                    Instant.now()
            );
            AttendanceRecord saved = attendanceRepository.saveAndFlush(record);
            return mapToDto(saved);
        } catch (DataIntegrityViolationException e) {
            throw new IllegalArgumentException("Attendance for this student in this trip already exists.", e);
        }
    }

    @Transactional(readOnly = true)
    public List<AttendanceRecordDto> getAttendanceForTrip(String tripId) {
        return attendanceRepository.findByTripId(tripId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private AttendanceRecordDto mapToDto(AttendanceRecord entity) {
        return new AttendanceRecordDto(
                entity.getId(),
                entity.getTripId(),
                entity.getStudentId(),
                entity.getStatus(),
                entity.getSource(),
                entity.getMarkedBy(),
                entity.getTimestamp()
        );
    }
}
