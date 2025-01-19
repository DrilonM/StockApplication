package com.dataaccessapi.service;

import com.dataaccessapi.dto.IndexDto;
import java.util.List;
import java.util.Map;

public interface IndexService {
    List<IndexDto> findAll();
    Map<String, List<IndexDto>> findLastSevenDaysPerIssuer();

    List<IndexDto> findByIssuerAndDateRange(String issuer, String startDate, String endDate);

    List<String> findAllDistinctIssuers();
}
