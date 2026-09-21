package com.calculator.controller;

import com.calculator.dto.CalculateRequest;
import com.calculator.dto.CalculateResponse;
import com.calculator.model.CalculationRecord;
import com.calculator.service.CalculatorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class CalculatorController {

    private final CalculatorService calculatorService;

    @Autowired
    public CalculatorController(CalculatorService calculatorService) {
        this.calculatorService = calculatorService;
    }

    @PostMapping("/calculator/calculate")
    public ResponseEntity<CalculateResponse> calculate(@RequestBody CalculateRequest request) {
        CalculateResponse response = calculatorService.calculate(request);
        if (!response.isSuccess()) {
            return ResponseEntity.badRequest().body(response);
        }
        return ResponseEntity.ok(response);
    }

    @GetMapping("/calculator/history")
    public ResponseEntity<List<CalculationRecord>> getHistory() {
        return ResponseEntity.ok(calculatorService.getHistory());
    }

    @DeleteMapping("/calculator/history")
    public ResponseEntity<Map<String, String>> clearHistory() {
        calculatorService.clearHistory();
        Map<String, String> response = new HashMap<>();
        response.put("message", "Calculation history cleared successfully.");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> health = new HashMap<>();
        health.put("status", "UP");
        health.put("service", "calculator-backend");
        health.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(health);
    }
}
