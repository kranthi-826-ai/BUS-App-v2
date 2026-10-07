package com.smartbus.trip.repository;

import com.smartbus.trip.entity.Trip;
import com.smartbus.trip.entity.TripStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TripRepository extends JpaRepository<Trip, String> {
    Optional<Trip> findByBusIdAndStatus(String busId, TripStatus status);
    Optional<Trip> findByIdAndStatus(String id, TripStatus status);
    List<Trip> findByStatus(TripStatus status);
}
