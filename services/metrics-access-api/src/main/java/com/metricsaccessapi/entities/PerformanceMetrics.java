package com.metricsaccessapi.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Table(name = "performance_metrics")
@NoArgsConstructor
@AllArgsConstructor
public class PerformanceMetrics {
    @Id
    private String issuer;
    private String link;
    private Double growth23v22;
    private Double growth22v21;
    private Double operating_margin23;
    private Double operating_margin22;
    private Double net_margin23;
    private Double net_margin22;
    private Double roe23;
    private Double roe22;
    private Double debt_equity23;
    private Double debt_equity22;
    private Double pe_ratio23;
    private String performance;
}
