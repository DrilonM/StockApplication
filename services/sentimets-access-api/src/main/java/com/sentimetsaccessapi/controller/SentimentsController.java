package com.sentimetsaccessapi.controller;

import com.sentimetsaccessapi.dto.NewsSentimentsDto;
import com.sentimetsaccessapi.service.NewsSentimentsService;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/api")
@Validated
@CrossOrigin(origins="*")
public class SentimentsController {
    NewsSentimentsService newsSentimentsService;

    public SentimentsController(NewsSentimentsService newsSentimentsService) {
        this.newsSentimentsService = newsSentimentsService;
    }
    @GetMapping("/news-sentiments")
    public ResponseEntity<List<NewsSentimentsDto>> getNewsSentiments(
            @RequestParam(name = "issuer") String issuer
    ) {
        List<NewsSentimentsDto> dtos = newsSentimentsService.getNewsSentiments(issuer);
        if (!dtos.isEmpty()) {
            return ResponseEntity.ok(dtos);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
