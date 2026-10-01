import os
import textwrap

base_dir = "backend/src/main/java/com/smartbus/alert"

def create_file(path, content):
    full_path = os.path.join(base_dir, path)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(textwrap.dedent(content).strip() + "\n")

create_file("service/AlertProcessorService.java", """
package com.smartbus.alert.service;

import com.smartbus.alert.entity.*;
import com.smartbus.alert.repository.*;
import com.smartbus.trip.entity.Trip;
import com.smartbus.trip.repository.TripRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class AlertProcessorService {

    private final TripRepository tripRepository;
    private final AlertSubscriptionRepository subscriptionRepository;
    private final AlertStateRepository stateRepository;
    private final PushDeviceRepository deviceRepository;
    private final NotificationOutboxRepository outboxRepository;

    public AlertProcessorService(TripRepository tripRepository,
                                 AlertSubscriptionRepository subscriptionRepository,
                                 AlertStateRepository stateRepository,
                                 PushDeviceRepository deviceRepository,
                                 NotificationOutboxRepository outboxRepository) {
        this.tripRepository = tripRepository;
        this.subscriptionRepository = subscriptionRepository;
        this.stateRepository = stateRepository;
        this.deviceRepository = deviceRepository;
        this.outboxRepository = outboxRepository;
    }

    @Transactional
    public void processLocation(String tripId, double lat, double lon) {
        Trip trip = tripRepository.findById(tripId).orElse(null);
        if (trip == null) return;

        List<AlertSubscription> subscriptions = subscriptionRepository.findByBusIdAndEnabledTrue(trip.getBus().getId());
        for (AlertSubscription sub : subscriptions) {
            double distance = haversine(lat, lon, sub.getStop().getLatitude(), sub.getStop().getLongitude());

            AlertState state = stateRepository.findBySubscriptionIdAndTripId(sub.getId(), trip.getId())
                    .orElseGet(() -> {
                        AlertState newState = new AlertState();
                        newState.setId(UUID.randomUUID().toString());
                        newState.setSubscription(sub);
                        newState.setTrip(trip);
                        newState.setState("OUTSIDE");
                        return newState;
                    });

            state.setLastDistanceMeters(distance);

            String currentState = state.getState();
            if ("OUTSIDE".equals(currentState) || "APPROACHING".equals(currentState)) {
                if (distance <= sub.getRadiusMeters()) {
                    state.setState("NOTIFIED");
                    state.setNotifiedAt(LocalDateTime.now());
                    createOutboxEntries(sub, trip);
                } else if ("OUTSIDE".equals(currentState) && distance <= sub.getRadiusMeters() + 2000) {
                    state.setState("APPROACHING");
                }
            } else if ("NOTIFIED".equals(currentState)) {
                if (distance > sub.getRadiusMeters() + 200) {
                    state.setState("OUTSIDE");
                    state.setRearmedAt(LocalDateTime.now());
                }
            }

            stateRepository.save(state);
        }
    }

    private void createOutboxEntries(AlertSubscription sub, Trip trip) {
        List<PushDevice> devices = deviceRepository.findByUserIdAndRevokedFalse(sub.getStudent().getId());
        for (PushDevice device : devices) {
            NotificationOutbox outbox = new NotificationOutbox();
            outbox.setId(UUID.randomUUID().toString());
            outbox.setEventId("ARRIVING_" + trip.getId() + "_" + sub.getStop().getId());
            outbox.setRecipient(sub.getStudent());
            outbox.setDevice(device);
            outbox.setPayload("{\\"title\\":\\"Bus Approaching\\",\\"body\\":\\"Bus is approaching " + sub.getStop().getName() + "\\"}");
            outbox.setState("PENDING");
            outbox.setAttempts(0);
            outbox.setNextAttemptAt(LocalDateTime.now());
            outboxRepository.save(outbox);
        }
    }

    private double haversine(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371000; // Radius of the earth in m
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
}
""")
