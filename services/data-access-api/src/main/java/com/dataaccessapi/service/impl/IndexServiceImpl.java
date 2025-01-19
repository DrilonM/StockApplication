package com.dataaccessapi.service.impl;

import com.dataaccessapi.dto.IndexDto;
import com.dataaccessapi.entities.Index;
import com.dataaccessapi.repository.IndexRepository;
import com.dataaccessapi.service.IndexService;
import org.springframework.stereotype.Service;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class IndexServiceImpl implements IndexService {
    private final IndexRepository indexRepository;


    public IndexServiceImpl(IndexRepository indexRepository) {
        this.indexRepository = indexRepository;
    }

    public List<IndexDto> findAll() {
        List<Index> data = indexRepository.findAll();
        return data.stream()
                .map(IndexDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public Map<String, List<IndexDto>> findLastSevenDaysPerIssuer() {
        List<String> issuers = indexRepository.findAll()
                .stream()
                .map(Index::getIssuer)
                .distinct()
                .collect(Collectors.toList());

        Map<String, List<IndexDto>> result = new HashMap<>();

        for (String issuer : issuers) {
            List<Index> latestSeven = indexRepository.findByIssuerOrderByDateDesc(issuer)
                    .stream()
                    .limit(7)
                    .collect(Collectors.toList());

            if (latestSeven.size() == 7) {
                Collections.reverse(latestSeven);

                List<IndexDto> dtoList = latestSeven.stream()
                        .map(IndexDto::fromEntity)
                        .collect(Collectors.toList());

                result.put(issuer, dtoList);
            }
        }

        return result;
    }

    @Override
    public List<IndexDto> findByIssuerAndDateRange(String issuer, String startDate, String endDate) {
        List<Index> data = indexRepository.findByIssuerAndDateBetween(issuer, startDate, endDate);
        return data.stream()
                .map(IndexDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public List<String> findAllDistinctIssuers() {
        return indexRepository.findDistinctIssuers();
    }

}

