// src/main/java/com/backend/service/PrecomputedMetricsService.java
package com.metricsaccessapi.service;

import com.metricsaccessapi.dto.PrecomputedMetricsDto;

public interface PrecomputedMetricsService {
    PrecomputedMetricsDto getMetrics(String issuer, String period);
}
