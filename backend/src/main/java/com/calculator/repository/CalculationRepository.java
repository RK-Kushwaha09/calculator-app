package com.calculator.repository;

import com.calculator.model.CalculationRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CalculationRepository extends JpaRepository<CalculationRecord, Long> {
    List<CalculationRecord> findAllByOrderByCreatedAtDesc();
}
