package com.smartbus.alert.repository;

import com.smartbus.alert.entity.AlertSubscription;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface AlertSubscriptionRepository extends JpaRepository<AlertSubscription, String> {
    Optional<AlertSubscription> findByStudentIdAndBusIdAndStopId(String studentId, String busId, String stopId);
    List<AlertSubscription> findByStudentId(String studentId);
    List<AlertSubscription> findByBusIdAndEnabledTrue(String busId);
}
