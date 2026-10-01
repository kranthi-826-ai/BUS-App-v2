package com.smartbus.common.repository;

import com.smartbus.common.entity.College;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CollegeRepository extends JpaRepository<College, String> {
    Optional<College> findByCode(String code);
}
