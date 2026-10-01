package com.smartbus.alert.repository;

import com.smartbus.alert.entity.PushDevice;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface PushDeviceRepository extends JpaRepository<PushDevice, String> {
    Optional<PushDevice> findByUserIdAndInstallationId(String userId, String installationId);
    List<PushDevice> findByUserIdAndRevokedFalse(String userId);
}
