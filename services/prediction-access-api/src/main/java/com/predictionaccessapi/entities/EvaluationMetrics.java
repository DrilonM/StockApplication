package com.predictionaccessapi.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "evaluation_metrics")
@Data
public class EvaluationMetrics {
    @Id
    private String issuer;
    private Double r2;
    private Double mae;
    private Double rmse;
    private Double last_trade_price;
}
