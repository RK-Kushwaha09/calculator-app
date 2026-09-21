package com.calculator.service;

import com.calculator.dto.CalculateRequest;
import com.calculator.dto.CalculateResponse;
import com.calculator.model.CalculationRecord;
import com.calculator.repository.CalculationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CalculatorService {

    private final CalculationRepository repository;

    @Autowired
    public CalculatorService(CalculationRepository repository) {
        this.repository = repository;
    }

    public CalculateResponse calculate(CalculateRequest request) {
        if (request.getOperand1() == null) {
            return CalculateResponse.error("First operand is required.");
        }
        if (request.getOperator() == null || request.getOperator().trim().isEmpty()) {
            return CalculateResponse.error("Operator is required.");
        }

        String op = request.getOperator().trim();
        Double a = request.getOperand1();
        Double b = request.getOperand2();
        Double result;
        String formattedExpression;

        switch (op) {
            case "+":
                if (b == null) return CalculateResponse.error("Second operand is required for addition.");
                result = a + b;
                formattedExpression = formatNum(a) + " + " + formatNum(b);
                break;
            case "-":
                if (b == null) return CalculateResponse.error("Second operand is required for subtraction.");
                result = a - b;
                formattedExpression = formatNum(a) + " - " + formatNum(b);
                break;
            case "*":
            case "x":
            case "×":
                if (b == null) return CalculateResponse.error("Second operand is required for multiplication.");
                result = a * b;
                formattedExpression = formatNum(a) + " × " + formatNum(b);
                break;
            case "/":
            case "÷":
                if (b == null) return CalculateResponse.error("Second operand is required for division.");
                if (b == 0.0) {
                    return CalculateResponse.error("Cannot divide by zero.");
                }
                result = a / b;
                formattedExpression = formatNum(a) + " ÷ " + formatNum(b);
                break;
            case "%":
                if (b == null) {
                    // Percentage of a number (a / 100)
                    result = a / 100.0;
                    formattedExpression = formatNum(a) + "%";
                } else {
                    if (b == 0.0) {
                        return CalculateResponse.error("Cannot modulo by zero.");
                    }
                    result = a % b;
                    formattedExpression = formatNum(a) + " % " + formatNum(b);
                }
                break;
            case "^":
            case "pow":
                if (b == null) return CalculateResponse.error("Exponent operand is required.");
                result = Math.pow(a, b);
                formattedExpression = formatNum(a) + " ^ " + formatNum(b);
                break;
            case "sqrt":
            case "√":
                if (a < 0) {
                    return CalculateResponse.error("Cannot calculate square root of a negative number.");
                }
                result = Math.sqrt(a);
                formattedExpression = "√(" + formatNum(a) + ")";
                break;
            default:
                return CalculateResponse.error("Unsupported operator: " + op);
        }

        // Clean up -0.0
        if (result != null && result == 0.0) {
            result = 0.0;
        }

        // Save to MySQL database
        CalculationRecord record = new CalculationRecord(a, op, b, formattedExpression, result);
        CalculationRecord saved = repository.save(record);

        return CalculateResponse.success(
                saved.getId(),
                saved.getOperand1(),
                saved.getOperator(),
                saved.getOperand2(),
                saved.getExpression(),
                saved.getResult(),
                saved.getCreatedAt()
        );
    }

    public List<CalculationRecord> getHistory() {
        return repository.findAllByOrderByCreatedAtDesc();
    }

    public void clearHistory() {
        repository.deleteAll();
    }

    private String formatNum(Double num) {
        if (num == null) return "";
        if (num == num.longValue()) {
            return String.format("%d", num.longValue());
        }
        return String.valueOf(num);
    }
}
