package com.metricsaccessapi.service;

import com.metricsaccessapi.dto.PerformanceMetricsDto;

public interface PerformanceMetricsService {
    PerformanceMetricsDto getPerformanceMetrics(String issuer);
}
