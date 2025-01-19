// NextMonthPredictionKey.java
package com.predictionaccessapi.entities;

import lombok.Data;

import java.io.Serializable;
import java.util.Objects;

@Data
public class NextMonthPredictionKey implements Serializable {
    private String issuer;
    private String date;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof NextMonthPredictionKey)) return false;
        NextMonthPredictionKey that = (NextMonthPredictionKey) o;
        return Objects.equals(issuer, that.issuer) &&
                Objects.equals(date, that.date);
    }

    @Override
    public int hashCode() {
        return Objects.hash(issuer, date);
    }
}
