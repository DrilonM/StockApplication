package com.predictionaccessapi.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "next_month_predictions")
@IdClass(NextMonthPredictionKey.class)
@Data
public class NextMonthPrediction {
    @Id
    private String issuer;
    @Id
    private String date;  // e.g. "2024-01-01"
    private Double predicted_price;
}
