package com.sentimetsaccessapi.service.impl;

import com.sentimetsaccessapi.dto.NewsSentimentsDto;
import com.sentimetsaccessapi.entities.NewsSentiments;
import com.sentimetsaccessapi.repository.NewsSentimentsRepository;
import com.sentimetsaccessapi.service.NewsSentimentsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NewsSentimentsServiceImpl implements NewsSentimentsService {

    @Autowired
    private NewsSentimentsRepository newsSentimentsRepository;

    @Override
    public List<NewsSentimentsDto> getNewsSentiments(String issuer) {
        List<NewsSentiments> sentimentsList = newsSentimentsRepository.findByIssuer(issuer);

        // Map entities to DTOs
        return sentimentsList.stream()
                .map(sentiments -> {
                    NewsSentimentsDto dto = new NewsSentimentsDto();
                    dto.setIssuer(sentiments.getIssuer());
                    dto.setLink(sentiments.getLink());
                    dto.setDate(sentiments.getDate());
                    dto.setTitle(sentiments.getTitle());
                    dto.setContent(sentiments.getContent());
                    dto.setSentiment(sentiments.getSentiment());
                    return dto;
                })
                .collect(Collectors.toList());
    }
}
