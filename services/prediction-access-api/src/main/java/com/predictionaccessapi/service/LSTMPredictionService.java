// LSTMPredictionService.java
package com.predictionaccessapi.service;

import com.predictionaccessapi.dto.LSTMPredictionResponseDto;
import com.predictionaccessapi.dto.LSTMSummaryResponseDto;
import com.predictionaccessapi.entities.NextMonthPrediction;

import java.util.List;

public interface LSTMPredictionService {
    LSTMPredictionResponseDto getPredictionsForIssuer(String issuer);
    List<String> findAllDistinctIssuers();
    public List<NextMonthPrediction> findAllLSTMPredictions();
    List<LSTMSummaryResponseDto> findLastPerIssuer();
}
