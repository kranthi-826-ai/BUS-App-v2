package com.smartbus.transport.repository;

import com.smartbus.transport.entity.RouteStop;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RouteStopRepository extends JpaRepository<RouteStop, String> {
    List<RouteStop> findByRouteIdOrderBySequenceNumAsc(String routeId);
    boolean existsByRouteIdAndStopId(String routeId, String stopId);
}
