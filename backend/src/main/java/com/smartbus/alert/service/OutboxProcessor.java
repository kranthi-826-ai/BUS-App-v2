package com.smartbus.alert.service;

import com.smartbus.alert.entity.NotificationOutbox;
import com.smartbus.alert.repository.NotificationOutboxRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OutboxProcessor {

    private final NotificationOutboxRepository outboxRepository;

    public OutboxProcessor(NotificationOutboxRepository outboxRepository) {
        this.outboxRepository = outboxRepository;
    }

    @Scheduled(fixedDelay = 5000)
    @Transactional
    public void processOutbox() {
        List<NotificationOutbox> pending = outboxRepository.findByStateAndNextAttemptAtBefore("PENDING", LocalDateTime.now());
        for (NotificationOutbox outbox : pending) {
            try {
                // Mock Expo Push Client
                sendPushNotification(outbox.getDevice().getTokenValue(), outbox.getPayload());
                outbox.setState("SENT");
            } catch (Exception e) {
                outbox.setAttempts(outbox.getAttempts() + 1);
                if (outbox.getAttempts() >= 3) {
                    outbox.setState("FAILED");
                } else {
                    outbox.setNextAttemptAt(LocalDateTime.now().plusMinutes(1));
                }
            }
            outboxRepository.save(outbox);
        }
    }

    private void sendPushNotification(String token, String payload) {
        // Fake push send
        if (token == null || token.isEmpty()) {
            throw new RuntimeException("Invalid token");
        }
        System.out.println("Sending push to " + token + ": " + payload);
    }
}
