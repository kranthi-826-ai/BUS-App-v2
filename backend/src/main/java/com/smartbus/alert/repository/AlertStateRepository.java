package com.smartbus.alert.repository;

import com.smartbus.alert.entity.AlertState;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface AlertStateRepository extends JpaRepository<AlertState, String> {
    Optional<AlertState> findBySubscriptionIdAndTripId(String subscriptionId, String tripId);
}
