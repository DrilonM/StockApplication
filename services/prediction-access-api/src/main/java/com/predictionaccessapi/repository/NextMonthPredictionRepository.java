// NextMonthPredictionRepository.java
package com.predictionaccessapi.repository;

import com.predictionaccessapi.entities.NextMonthPrediction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NextMonthPredictionRepository extends JpaRepository<NextMonthPrediction, Long> {
    List<NextMonthPrediction> findByIssuerOrderByDateAsc(@Param("issuer") String issuer);

    @Query("SELECT p FROM NextMonthPrediction p WHERE p.date = (SELECT MAX(p2.date) FROM NextMonthPrediction p2 WHERE p2.issuer = p.issuer)")
    List<NextMonthPrediction> findLatestPricePerIssuer();
}
