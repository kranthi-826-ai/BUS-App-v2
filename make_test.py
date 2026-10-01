import os
import textwrap

base_dir = "backend/src/test/java/com/smartbus/alert"

def create_file(path, content):
    full_path = os.path.join(base_dir, path)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(textwrap.dedent(content).strip() + "\n")

create_file("AlertIntegrationTest.java", """
package com.smartbus.alert;

import com.smartbus.alert.entity.AlertSubscription;
import com.smartbus.alert.entity.AlertState;
import com.smartbus.alert.entity.PushDevice;
import com.smartbus.alert.repository.AlertSubscriptionRepository;
import com.smartbus.alert.repository.AlertStateRepository;
import com.smartbus.alert.repository.PushDeviceRepository;
import com.smartbus.alert.repository.NotificationOutboxRepository;
import com.smartbus.alert.service.AlertProcessorService;
import com.smartbus.common.entity.College;
import com.smartbus.common.entity.User;
import com.smartbus.transport.entity.Bus;
import com.smartbus.transport.entity.Route;
import com.smartbus.transport.entity.Stop;
import com.smartbus.trip.entity.Trip;
import com.smartbus.trip.repository.TripRepository;
import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.Instant;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Transactional
public class AlertIntegrationTest {

    @Autowired private AlertProcessorService processorService;
    @Autowired private AlertSubscriptionRepository subscriptionRepository;
    @Autowired private AlertStateRepository stateRepository;
    @Autowired private PushDeviceRepository deviceRepository;
    @Autowired private NotificationOutboxRepository outboxRepository;
    @Autowired private TripRepository tripRepository;
    @Autowired private EntityManager em;

    private User student;
    private Bus bus;
    private Stop stop;
    private Trip trip;
    private PushDevice device;
    private AlertSubscription sub;

    @BeforeEach
    public void setup() {
        College college = new College();
        college.setId(UUID.randomUUID().toString());
        college.setName("Test College");
        em.persist(college);

        student = new User();
        student.setId(UUID.randomUUID().toString());
        student.setCollege(college);
        student.setName("Student");
        student.setEmail("student@test.com");
        student.setPasswordHash("hash");
        student.setRole("STUDENT");
        student.setActive(true);
        em.persist(student);

        User driver = new User();
        driver.setId(UUID.randomUUID().toString());
        driver.setCollege(college);
        driver.setName("Driver");
        driver.setEmail("driver@test.com");
        driver.setPasswordHash("hash");
        driver.setRole("DRIVER");
        driver.setActive(true);
        em.persist(driver);

        bus = new Bus();
        bus.setId(UUID.randomUUID().toString());
        bus.setCollege(college);
        bus.setRegistrationNumber("BUS-123");
        bus.setCapacity(50);
        em.persist(bus);

        stop = new Stop();
        stop.setId(UUID.randomUUID().toString());
        stop.setCollege(college);
        stop.setName("Home Stop");
        stop.setLatitude(10.0);
        stop.setLongitude(20.0);
        em.persist(stop);

        Route route = new Route();
        route.setId(UUID.randomUUID().toString());
        route.setCollege(college);
        route.setName("Route 1");
        em.persist(route);

        trip = new Trip();
        trip.setId(UUID.randomUUID().toString());
        trip.setBus(bus);
        trip.setRoute(route);
        trip.setIncharge(driver);
        tripRepository.save(trip);

        device = new PushDevice();
        device.setId(UUID.randomUUID().toString());
        device.setUser(student);
        device.setInstallationId("inst-1");
        device.setTokenValue("token-1");
        device.setPlatform("ANDROID");
        device.setLastSeen(LocalDateTime.now());
        deviceRepository.save(device);

        sub = new AlertSubscription();
        sub.setId(UUID.randomUUID().toString());
        sub.setStudent(student);
        sub.setBus(bus);
        sub.setStop(stop);
        sub.setRadiusMeters(1000);
        sub.setEnabled(true);
        subscriptionRepository.save(sub);
        
        em.flush();
        em.clear();
    }

    @Test
    public void testAlertLifecycle() {
        // 1. Outside radius - distance is very far (~111km per degree)
        processorService.processLocation(trip.getId(), 11.0, 20.0);
        AlertState state = stateRepository.findBySubscriptionIdAndTripId(sub.getId(), trip.getId()).get();
        assertThat(state.getState()).isEqualTo("OUTSIDE");
        assertThat(outboxRepository.count()).isEqualTo(0);

        // 2. Just outside approach radius (say distance is 2km). 
        // 1 degree lat is ~111km, so 0.015 degrees is ~1.6km
        processorService.processLocation(trip.getId(), 10.015, 20.0);
        state = stateRepository.findBySubscriptionIdAndTripId(sub.getId(), trip.getId()).get();
        assertThat(state.getState()).isEqualTo("APPROACHING");
        assertThat(outboxRepository.count()).isEqualTo(0);

        // 3. Enter radius (0.005 degrees is ~550m)
        processorService.processLocation(trip.getId(), 10.005, 20.0);
        state = stateRepository.findBySubscriptionIdAndTripId(sub.getId(), trip.getId()).get();
        assertThat(state.getState()).isEqualTo("NOTIFIED");
        assertThat(outboxRepository.count()).isEqualTo(1);

        // 4. Stay in radius - no duplicate alert
        processorService.processLocation(trip.getId(), 10.002, 20.0);
        state = stateRepository.findBySubscriptionIdAndTripId(sub.getId(), trip.getId()).get();
        assertThat(state.getState()).isEqualTo("NOTIFIED");
        assertThat(outboxRepository.count()).isEqualTo(1); // Still 1

        // 5. Leave radius but within hysteresis (+200m = 1200m). 0.01 degrees = 1.11km
        processorService.processLocation(trip.getId(), 10.01, 20.0);
        state = stateRepository.findBySubscriptionIdAndTripId(sub.getId(), trip.getId()).get();
        assertThat(state.getState()).isEqualTo("NOTIFIED");
        assertThat(outboxRepository.count()).isEqualTo(1); // Still 1

        // 6. Leave hysteresis radius (re-arm) - 0.02 degrees = 2.22km
        processorService.processLocation(trip.getId(), 10.02, 20.0);
        state = stateRepository.findBySubscriptionIdAndTripId(sub.getId(), trip.getId()).get();
        assertThat(state.getState()).isEqualTo("OUTSIDE");
        assertThat(outboxRepository.count()).isEqualTo(1);

        // 7. Enter radius again (trigger second alert)
        processorService.processLocation(trip.getId(), 10.005, 20.0);
        state = stateRepository.findBySubscriptionIdAndTripId(sub.getId(), trip.getId()).get();
        assertThat(state.getState()).isEqualTo("NOTIFIED");
        assertThat(outboxRepository.count()).isEqualTo(2); // New alert generated
    }
}
""")
