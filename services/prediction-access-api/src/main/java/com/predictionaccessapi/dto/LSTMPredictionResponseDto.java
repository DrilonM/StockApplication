// LSTMPredictionResponseDto.java
package com.predictionaccessapi.dto;

import lombok.Data;

import java.util.List;

@Data
public class LSTMPredictionResponseDto {
    private String issuer;
    private Double r2Score;
    private Double meanAbsoluteError;
    private Double rootMeanSquaredError;
    private Double lastTradPrice;

    private Double tomorrowPrice;
    private Double tomorrowPercentChange;

    private Double nextWeekPrice;
    private Double nextWeekPercentChange;

    private Double nextMonthPrice;
    private Double nextMonthPercentChange;

    private List<PredictionRowDto> predictionRows;  // next 30 days
}
