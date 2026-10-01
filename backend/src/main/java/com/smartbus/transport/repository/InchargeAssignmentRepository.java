package com.smartbus.transport.repository;
import com.smartbus.transport.entity.InchargeAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;

public interface InchargeAssignmentRepository extends JpaRepository<InchargeAssignment, String> {
    @Query("SELECT COUNT(a) > 0 FROM InchargeAssignment a WHERE a.user.id = :userId AND " +
           "(cast(:validTo as date) IS NULL OR a.validFrom <= :validTo) AND " +
           "(a.validTo IS NULL OR a.validTo >= :validFrom)")
    boolean hasOverlappingUserAssignment(@Param("userId") String userId, @Param("validFrom") LocalDate validFrom, @Param("validTo") LocalDate validTo);

    @Query("SELECT COUNT(a) > 0 FROM InchargeAssignment a WHERE a.bus.id = :busId AND " +
           "(cast(:validTo as date) IS NULL OR a.validFrom <= :validTo) AND " +
           "(a.validTo IS NULL OR a.validTo >= :validFrom)")
    boolean hasOverlappingBusAssignment(@Param("busId") String busId, @Param("validFrom") LocalDate validFrom, @Param("validTo") LocalDate validTo);
}
