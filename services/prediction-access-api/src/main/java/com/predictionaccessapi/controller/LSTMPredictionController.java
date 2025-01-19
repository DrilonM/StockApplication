// LSTMPredictionController.java
package com.predictionaccessapi.controller;

import com.predictionaccessapi.dto.LSTMPredictionResponseDto;
import com.predictionaccessapi.dto.LSTMSummaryResponseDto;
import com.predictionaccessapi.service.LSTMPredictionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class LSTMPredictionController {

    @Autowired
    private LSTMPredictionService lstmPredictionService;

    @GetMapping("/lstm-predictions")
    public ResponseEntity<LSTMPredictionResponseDto> getLSTMPredictions(@RequestParam("issuer") String issuer) {
        LSTMPredictionResponseDto result = lstmPredictionService.getPredictionsForIssuer(issuer);
        if (result != null) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/lstm-issuers")
    public ResponseEntity<List<String>> getAllIssuers() {
        List<String> issuers = lstmPredictionService.findAllDistinctIssuers();
        return new ResponseEntity<>(issuers, HttpStatus.OK);
    }

    @GetMapping("/lstm/summary")
    public ResponseEntity<List<LSTMSummaryResponseDto>> getLSTMTopPredictions() {
        List<LSTMSummaryResponseDto> result = lstmPredictionService.findLastPerIssuer();

        if (result != null) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
