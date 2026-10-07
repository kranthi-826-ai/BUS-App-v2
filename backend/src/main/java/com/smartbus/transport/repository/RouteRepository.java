package com.smartbus.transport.repository;
import com.smartbus.transport.entity.Route;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface RouteRepository extends JpaRepository<Route, String> {
	List<Route> findByCollegeIdAndActiveTrue(String collegeId);
}
