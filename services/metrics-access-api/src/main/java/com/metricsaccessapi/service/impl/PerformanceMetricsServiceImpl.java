package com.metricsaccessapi.service.impl;

import com.metricsaccessapi.dto.PerformanceMetricsDto;
import com.metricsaccessapi.entities.PerformanceMetrics;
import com.metricsaccessapi.repository.PerformanceMetricsRepository;
import com.metricsaccessapi.service.PerformanceMetricsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class PerformanceMetricsServiceImpl implements PerformanceMetricsService {

    @Autowired
    private PerformanceMetricsRepository performanceMetricsRepository;

    @Override
    public PerformanceMetricsDto getPerformanceMetrics(String issuer) {
        Optional<PerformanceMetrics> metricsOpt = performanceMetricsRepository.findByIssuer(issuer);
        if (metricsOpt.isPresent()) {
            PerformanceMetrics metrics = metricsOpt.get();
            PerformanceMetricsDto dto = new PerformanceMetricsDto();
            dto.setIssuer(metrics.getIssuer());
            dto.setLink(metrics.getLink());
            dto.setGrowth23v22(metrics.getGrowth23v22());
            dto.setGrowth22v21(metrics.getGrowth22v21());
            dto.setOperating_margin23(metrics.getOperating_margin23());
            dto.setOperating_margin22(metrics.getOperating_margin22());
            dto.setNet_margin22(metrics.getNet_margin22());
            dto.setNet_margin23(metrics.getNet_margin23());
            dto.setNet_margin22(metrics.getNet_margin22());
            dto.setRoe23(metrics.getRoe23());
            dto.setRoe22(metrics.getRoe22());
            dto.setDebt_equity23(metrics.getDebt_equity23());
            dto.setDebt_equity22(metrics.getDebt_equity22());
            dto.setPe_ratio23(metrics.getPe_ratio23());
            dto.setPerformance(metrics.getPerformance());
            return dto;
        } else
            return  null;
    }
}
