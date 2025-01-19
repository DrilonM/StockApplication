package com.sentimetsaccessapi.service;

import com.sentimetsaccessapi.dto.NewsSentimentsDto;
import java.util.List;

public interface NewsSentimentsService {
    List<NewsSentimentsDto> getNewsSentiments(String issuer);
}
