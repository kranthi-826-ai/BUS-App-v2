package com.smartbus.transport.repository;
import com.smartbus.transport.entity.StudentEnrolment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentEnrolmentRepository extends JpaRepository<StudentEnrolment, String> {}
