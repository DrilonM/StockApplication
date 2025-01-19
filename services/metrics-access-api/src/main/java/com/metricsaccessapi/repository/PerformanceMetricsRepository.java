package com.metricsaccessapi.repository;

import com.metricsaccessapi.entities.PerformanceMetrics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PerformanceMetricsRepository extends JpaRepository<PerformanceMetrics, Long> {
    Optional<PerformanceMetrics> findByIssuer(@Param("issuer") String issuer);
}
