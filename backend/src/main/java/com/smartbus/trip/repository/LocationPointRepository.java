package com.smartbus.trip.repository;

import com.smartbus.trip.entity.LocationPoint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LocationPointRepository extends JpaRepository<LocationPoint, String> {
    boolean existsByTripIdAndDeviceIdAndSequenceNum(String tripId, String deviceId, Long sequenceNum);
}
