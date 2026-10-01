package com.smartbus.trip.repository;

import com.smartbus.trip.entity.LatestBusLocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LatestBusLocationRepository extends JpaRepository<LatestBusLocation, String> {
}
