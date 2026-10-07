package com.smartbus.transport.repository;
import com.smartbus.transport.entity.StudentEnrolment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface StudentEnrolmentRepository extends JpaRepository<StudentEnrolment, String> {
	boolean existsByStudentIdAndBusIdAndStatus(String studentId, String busId, String status);
	boolean existsByStudentIdAndStatus(String studentId, String status);
	Optional<StudentEnrolment> findByStudentIdAndStatus(String studentId, String status);
}
