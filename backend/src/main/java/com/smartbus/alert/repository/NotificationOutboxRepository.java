package com.smartbus.alert.repository;

import com.smartbus.alert.entity.NotificationOutbox;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface NotificationOutboxRepository extends JpaRepository<NotificationOutbox, String> {
    List<NotificationOutbox> findByStateAndNextAttemptAtBefore(String state, LocalDateTime time);
}
