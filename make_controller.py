import os
import textwrap

base_dir = "backend/src/main/java/com/smartbus/alert"

def create_file(path, content):
    full_path = os.path.join(base_dir, path)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(textwrap.dedent(content).strip() + "\n")

create_file("controller/AlertController.java", """
package com.smartbus.alert.controller;

import com.smartbus.alert.entity.AlertSubscription;
import com.smartbus.alert.entity.PushDevice;
import com.smartbus.alert.repository.AlertSubscriptionRepository;
import com.smartbus.alert.repository.PushDeviceRepository;
import com.smartbus.common.entity.User;
import com.smartbus.transport.entity.Bus;
import com.smartbus.transport.entity.Stop;
import jakarta.persistence.EntityManager;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/alerts")
public class AlertController {

    private final AlertSubscriptionRepository subscriptionRepository;
    private final PushDeviceRepository deviceRepository;
    private final EntityManager entityManager;

    public AlertController(AlertSubscriptionRepository subscriptionRepository,
                           PushDeviceRepository deviceRepository,
                           EntityManager entityManager) {
        this.subscriptionRepository = subscriptionRepository;
        this.deviceRepository = deviceRepository;
        this.entityManager = entityManager;
    }

    @PostMapping("/devices")
    @Transactional
    public ResponseEntity<?> registerDevice(@RequestBody Map<String, String> payload) {
        String userId = payload.get("userId");
        String installationId = payload.get("installationId");
        String token = payload.get("token");
        String platform = payload.get("platform");

        PushDevice device = deviceRepository.findByUserIdAndInstallationId(userId, installationId)
                .orElseGet(() -> {
                    PushDevice newDevice = new PushDevice();
                    newDevice.setId(UUID.randomUUID().toString());
                    newDevice.setUser(entityManager.getReference(User.class, userId));
                    newDevice.setInstallationId(installationId);
                    return newDevice;
                });
        
        device.setTokenValue(token);
        device.setPlatform(platform);
        device.setLastSeen(LocalDateTime.now());
        device.setRevoked(false);
        deviceRepository.save(device);

        return ResponseEntity.ok(device);
    }

    @PostMapping("/subscriptions")
    @Transactional
    public ResponseEntity<?> createSubscription(@RequestBody Map<String, Object> payload) {
        String studentId = (String) payload.get("studentId");
        String busId = (String) payload.get("busId");
        String stopId = (String) payload.get("stopId");
        int radius = (Integer) payload.getOrDefault("radiusMeters", 1000);

        AlertSubscription sub = subscriptionRepository.findByStudentIdAndBusIdAndStopId(studentId, busId, stopId)
                .orElseGet(() -> {
                    AlertSubscription newSub = new AlertSubscription();
                    newSub.setId(UUID.randomUUID().toString());
                    newSub.setStudent(entityManager.getReference(User.class, studentId));
                    newSub.setBus(entityManager.getReference(Bus.class, busId));
                    newSub.setStop(entityManager.getReference(Stop.class, stopId));
                    return newSub;
                });

        sub.setRadiusMeters(radius);
        sub.setEnabled(true);
        subscriptionRepository.save(sub);

        return ResponseEntity.ok(sub);
    }

    @GetMapping("/subscriptions")
    public ResponseEntity<List<AlertSubscription>> getSubscriptions(@RequestParam String studentId) {
        return ResponseEntity.ok(subscriptionRepository.findByStudentId(studentId));
    }

    @DeleteMapping("/subscriptions/{id}")
    @Transactional
    public ResponseEntity<?> deleteSubscription(@PathVariable String id) {
        subscriptionRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
""")
