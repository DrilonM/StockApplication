// PredictionRowDto.java
package com.predictionaccessapi.dto;

import lombok.Data;

@Data
public class PredictionRowDto {
    private String date;
    private Double predictedPrice;
    private Double percentChange;
}
