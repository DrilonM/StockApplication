// src/main/java/com/backend/repository/PrecomputedMetricsRepository.java
package com.metricsaccessapi.repository;

import com.metricsaccessapi.entities.PrecomputedMetrics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PrecomputedMetricsRepository extends JpaRepository<PrecomputedMetrics, Long> {
    Optional<PrecomputedMetrics> findByIssuerAndPeriod(@Param("issuer") String issuer,@Param("period") String period);
}
