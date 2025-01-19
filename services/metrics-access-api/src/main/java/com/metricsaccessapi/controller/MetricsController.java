package com.metricsaccessapi.controller;

import com.metricsaccessapi.dto.PerformanceMetricsDto;
import com.metricsaccessapi.dto.PrecomputedMetricsDto;
import com.metricsaccessapi.service.PerformanceMetricsService;
import com.metricsaccessapi.service.PrecomputedMetricsService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "/api")
@Validated
@CrossOrigin(origins="*")
public class MetricsController {
    PrecomputedMetricsService metricsService;
    PerformanceMetricsService performanceMetricsService;

    public MetricsController(PrecomputedMetricsService metricsService, PerformanceMetricsService performanceMetricsService) {
        this.metricsService = metricsService;
        this.performanceMetricsService = performanceMetricsService;
    }

    @GetMapping("/precomputed-metrics")
    public ResponseEntity<PrecomputedMetricsDto> getPrecomputedMetrics(
            @RequestParam(name = "issuer") String issuer,
            @RequestParam(name  = "period") String period
    ) {
        PrecomputedMetricsDto dto = metricsService.getMetrics(issuer, period);
        if (dto != null) {
            return ResponseEntity.ok(dto);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/performance-metrics")
    public ResponseEntity<PerformanceMetricsDto> getPerformanceMetrics(
            @RequestParam(name = "issuer") String issuer
    ) {
        PerformanceMetricsDto dto = performanceMetricsService.getPerformanceMetrics(issuer);
        if (dto != null) {
            return ResponseEntity.ok(dto);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
