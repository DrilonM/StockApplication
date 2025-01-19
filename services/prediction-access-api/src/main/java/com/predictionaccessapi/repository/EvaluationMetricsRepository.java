// EvaluationMetricsRepository.java
package com.predictionaccessapi.repository;

import com.predictionaccessapi.entities.EvaluationMetrics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EvaluationMetricsRepository extends JpaRepository<EvaluationMetrics, String> {

    EvaluationMetrics findByIssuer(@Param("issuer") String issuer);

    @Query("SELECT DISTINCT i.issuer FROM EvaluationMetrics i")
    List<String> findDistinctIssuers();
}
