package com.dataaccessapi.controller;

import com.dataaccessapi.dto.IndexDto;
import com.dataaccessapi.service.IndexService;
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
public class IndexController {
    IndexService indexService;

    public IndexController(IndexService indexService) {
        this.indexService = indexService;
    }

    @GetMapping("/all")
    public ResponseEntity<List<IndexDto>> getAll() {
        List<IndexDto> dtoData = indexService.findAll();

        return new ResponseEntity<>(dtoData, HttpStatus.OK);
    }

    @GetMapping("/last-seven-days")
    public ResponseEntity<Map<String, List<IndexDto>>> getLastSevenDaysPerIssuer() {
        Map<String, List<IndexDto>> data = indexService.findLastSevenDaysPerIssuer();
        return new ResponseEntity<>(data, HttpStatus.OK);
    }

    @GetMapping("/issuer-data")
    public ResponseEntity<List<IndexDto>> getIssuerData(
            @RequestParam(name = "issuer") String issuer,
            @RequestParam(name = "startDate") String startDate,
            @RequestParam(name = "endDate") String endDate
    ) {
        List<IndexDto> data = indexService.findByIssuerAndDateRange(issuer, startDate, endDate);
        return new ResponseEntity<>(data, HttpStatus.OK);
    }
    @GetMapping("/issuers")
    public ResponseEntity<List<String>> getAllIssuers() {
        List<String> issuers = indexService.findAllDistinctIssuers();
        return new ResponseEntity<>(issuers, HttpStatus.OK);
    }
}
