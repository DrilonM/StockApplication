package com.predictionaccessapi.dto;

import lombok.Data;

@Data
public class LSTMSummaryResponseDto {
    private String issuer;
    private Double nextMonthPrice;
    private Double nextMonthPercentChange;
}
