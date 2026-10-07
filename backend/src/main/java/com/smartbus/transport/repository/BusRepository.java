package com.smartbus.transport.repository;
import com.smartbus.transport.entity.Bus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface BusRepository extends JpaRepository<Bus, String> {
	List<Bus> findByCollegeIdAndActiveTrue(String collegeId);
}
