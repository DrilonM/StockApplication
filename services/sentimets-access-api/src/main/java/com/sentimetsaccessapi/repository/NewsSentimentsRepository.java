package com.sentimetsaccessapi.repository;

import com.sentimetsaccessapi.entities.NewsSentiments;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface NewsSentimentsRepository extends JpaRepository<NewsSentiments, Long> {
    @Query("SELECT n FROM NewsSentiments n WHERE n.issuer = :issuer ORDER BY n.date DESC")
    List<NewsSentiments> findByIssuer(@Param("issuer") String issuer);
}
