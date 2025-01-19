// LSTMPredictionServiceImpl.java
package com.predictionaccessapi.service.impl;

import com.predictionaccessapi.dto.LSTMPredictionResponseDto;
import com.predictionaccessapi.dto.LSTMSummaryResponseDto;
import com.predictionaccessapi.dto.PredictionRowDto;
import com.predictionaccessapi.entities.EvaluationMetrics;
import com.predictionaccessapi.entities.NextMonthPrediction;
import com.predictionaccessapi.repository.EvaluationMetricsRepository;
import com.predictionaccessapi.repository.NextMonthPredictionRepository;
import com.predictionaccessapi.service.LSTMPredictionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LSTMPredictionServiceImpl implements LSTMPredictionService {

    @Autowired
    private EvaluationMetricsRepository evaluationMetricsRepository;

    @Autowired
    private NextMonthPredictionRepository nextMonthPredictionRepository;

    @Override
    public LSTMPredictionResponseDto getPredictionsForIssuer(String issuer) {
        // 1) Get evaluation metrics
        EvaluationMetrics metrics = evaluationMetricsRepository.findByIssuer(issuer);
        if (metrics == null) {
            return null;
        }
        double currentPrice = metrics.getLast_trade_price();

        List<NextMonthPrediction> predictions = nextMonthPredictionRepository.findByIssuerOrderByDateAsc(issuer);


        if (predictions.size() < 20) {

            return null;
        }

        double tomorrowPrice = predictions.get(0).getPredicted_price();
        double nextWeekPrice = predictions.get(5).getPredicted_price();
        double nextMonthPrice = predictions.get(predictions.size()-1).getPredicted_price();

        LSTMPredictionResponseDto dto = new LSTMPredictionResponseDto();
        dto.setIssuer(issuer);
        dto.setR2Score(metrics.getR2());
        dto.setMeanAbsoluteError(metrics.getMae());
        dto.setRootMeanSquaredError(metrics.getRmse());
        dto.setLastTradPrice(currentPrice);

        dto.setTomorrowPrice(tomorrowPrice);
        dto.setTomorrowPercentChange(calcPercentChange(currentPrice, tomorrowPrice));

        dto.setNextWeekPrice(nextWeekPrice);
        dto.setNextWeekPercentChange(calcPercentChange(currentPrice, nextWeekPrice));

        dto.setNextMonthPrice(nextMonthPrice);
        dto.setNextMonthPercentChange(calcPercentChange(currentPrice, nextMonthPrice));

        // For the table
        List<PredictionRowDto> rowDtoList = predictions.stream()
                .map(pred -> {
                    PredictionRowDto row = new PredictionRowDto();
                    row.setDate(pred.getDate());
                    row.setPredictedPrice(pred.getPredicted_price());
                    row.setPercentChange(calcPercentChange(currentPrice, pred.getPredicted_price()));
                    return row;
                })
                .collect(Collectors.toList());

        dto.setPredictionRows(rowDtoList);

        return dto;
    }

    private Double calcPercentChange(double currentPrice, double futurePrice) {
        if (currentPrice == 0) return null;
        return ((futurePrice - currentPrice) / currentPrice) * 100.0;
    }

    @Override
    public List<String> findAllDistinctIssuers() {
        return evaluationMetricsRepository.findDistinctIssuers();
    }

    @Override
    public List<NextMonthPrediction> findAllLSTMPredictions() {
        List<NextMonthPrediction> data = nextMonthPredictionRepository.findAll();

        return data;
    }

    @Override
    public List<LSTMSummaryResponseDto> findLastPerIssuer() {
        List<NextMonthPrediction> data = nextMonthPredictionRepository.findLatestPricePerIssuer();

        List<LSTMSummaryResponseDto> summaryDtoList = new ArrayList<>();

        for (NextMonthPrediction prediction : data) {
            String issuer = prediction.getIssuer();
            Double predictedPrice = prediction.getPredicted_price();

            EvaluationMetrics metrics = evaluationMetricsRepository.findByIssuer(issuer);
            if (metrics != null) {
                Double currentPrice = metrics.getLast_trade_price();
                Double percentChange = calcPercentChange(currentPrice, predictedPrice);

                LSTMSummaryResponseDto summaryDto = new LSTMSummaryResponseDto();
                summaryDto.setIssuer(issuer);
                summaryDto.setNextMonthPrice(predictedPrice);
                summaryDto.setNextMonthPercentChange(percentChange);

                summaryDtoList.add(summaryDto);
            } else {
            }
        }

        return summaryDtoList;
    }

}
