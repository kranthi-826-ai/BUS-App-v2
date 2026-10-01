import os
import textwrap

base_dir = "backend/src/main/java/com/smartbus/alert"

def create_file(path, content):
    full_path = os.path.join(base_dir, path)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(textwrap.dedent(content).strip() + "\n")

create_file("repository/PushDeviceRepository.java", """
package com.smartbus.alert.repository;

import com.smartbus.alert.entity.PushDevice;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface PushDeviceRepository extends JpaRepository<PushDevice, String> {
    Optional<PushDevice> findByUserIdAndInstallationId(String userId, String installationId);
    List<PushDevice> findByUserIdAndRevokedFalse(String userId);
}
""")

create_file("repository/AlertSubscriptionRepository.java", """
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
""")

create_file("repository/AlertStateRepository.java", """
package com.smartbus.alert.repository;

import com.smartbus.alert.entity.AlertState;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface AlertStateRepository extends JpaRepository<AlertState, String> {
    Optional<AlertState> findBySubscriptionIdAndTripId(String subscriptionId, String tripId);
}
""")

create_file("repository/NotificationOutboxRepository.java", """
package com.smartbus.alert.repository;

import com.smartbus.alert.entity.NotificationOutbox;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface NotificationOutboxRepository extends JpaRepository<NotificationOutbox, String> {
    List<NotificationOutbox> findByStateAndNextAttemptAtBefore(String state, LocalDateTime time);
}
""")
