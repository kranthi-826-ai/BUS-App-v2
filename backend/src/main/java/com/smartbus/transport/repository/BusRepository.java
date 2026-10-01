package com.smartbus.transport.repository;
import com.smartbus.transport.entity.Bus;
import org.springframework.data.jpa.repository.JpaRepository;
public interface BusRepository extends JpaRepository<Bus, String> {}
