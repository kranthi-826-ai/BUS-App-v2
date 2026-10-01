package com.smartbus.transport.repository;
import com.smartbus.transport.entity.BusRouteAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;

public interface BusRouteAssignmentRepository extends JpaRepository<BusRouteAssignment, String> {
    @Query("SELECT COUNT(a) > 0 FROM BusRouteAssignment a WHERE a.bus.id = :busId AND " +
           "(cast(:validTo as date) IS NULL OR a.validFrom <= :validTo) AND " +
           "(a.validTo IS NULL OR a.validTo >= :validFrom)")
    boolean hasOverlappingBusAssignment(@Param("busId") String busId, @Param("validFrom") LocalDate validFrom, @Param("validTo") LocalDate validTo);

    @Query("SELECT COUNT(a) > 0 FROM BusRouteAssignment a WHERE a.route.id = :routeId AND " +
           "(cast(:validTo as date) IS NULL OR a.validFrom <= :validTo) AND " +
           "(a.validTo IS NULL OR a.validTo >= :validFrom)")
    boolean hasOverlappingRouteAssignment(@Param("routeId") String routeId, @Param("validFrom") LocalDate validFrom, @Param("validTo") LocalDate validTo);
}
