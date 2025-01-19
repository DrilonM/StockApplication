package com.dataaccessapi.dto;

import com.dataaccessapi.entities.Index;
import lombok.Data;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Data
public class IndexDto {
    private String issuer;
    private String date;
    private String last_trade_price;
    private String max;
    private String min;
    private String avg_price;
    private String percent_change;
    private String volume;
    private String turnover_best;
    private String total_turnover;

    public static IndexDto fromEntity(Index index) {
        IndexDto dto = new IndexDto();
        dto.setIssuer(index.getIssuer());
        dto.setDate(formatDateMacedonianFormat(index.getDate()));
        dto.setLast_trade_price(formatNumberMacedonianFormat(index.getLast_trade_price(),true));
        dto.setMax(formatNumberMacedonianFormat(index.getMax(),true));
        dto.setMin(formatNumberMacedonianFormat(index.getMin(),true));
        dto.setAvg_price(formatNumberMacedonianFormat(index.getAvg_price(),true));
        dto.setPercent_change(formatNumberMacedonianFormat(index.getPercent_change(),true));
        dto.setVolume(formatNumberMacedonianFormat(index.getVolume(), false));
        dto.setTurnover_best(formatNumberMacedonianFormat(index.getTurnover_best(), false));
        dto.setTotal_turnover(formatNumberMacedonianFormat(index.getTotal_turnover(), false));
        return dto;
    }

    private static String formatDateMacedonianFormat(String date) {
        return LocalDate.parse(date).format(DateTimeFormatter.ofPattern("dd.MM.yyyy"));
    }


    public static String formatNumberMacedonianFormat(Float number, boolean decimalpoint) {
        if(number==null) return "";

        String[] parts = String.format("%.2f", number).split("\\.");

        String integerPart = parts[0];
        String fractionalPart = parts[1];

        StringBuilder formattedInteger = new StringBuilder();
        for (int i = integerPart.length() - 1, count = 1; i >= 0; i--, count++) {
            formattedInteger.insert(0, integerPart.charAt(i));
            if (count % 3 == 0 && i > 0) {
                formattedInteger.insert(0, '.');
            }
        }

        return decimalpoint ? formattedInteger.toString() + "," + fractionalPart : formattedInteger.toString();
    }

}
