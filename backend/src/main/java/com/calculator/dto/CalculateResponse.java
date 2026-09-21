package com.calculator.dto;

import java.time.LocalDateTime;

public class CalculateResponse {
    private Long id;
    private Double operand1;
    private String operator;
    private Double operand2;
    private String expression;
    private Double result;
    private LocalDateTime createdAt;
    private boolean success;
    private String message;

    public CalculateResponse() {}

    public static CalculateResponse success(Long id, Double operand1, String operator, Double operand2, String expression, Double result, LocalDateTime createdAt) {
        CalculateResponse resp = new CalculateResponse();
        resp.id = id;
        resp.operand1 = operand1;
        resp.operator = operator;
        resp.operand2 = operand2;
        resp.expression = expression;
        resp.result = result;
        resp.createdAt = createdAt;
        resp.success = true;
        return resp;
    }

    public static CalculateResponse error(String message) {
        CalculateResponse resp = new CalculateResponse();
        resp.success = false;
        resp.message = message;
        return resp;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Double getOperand1() {
        return operand1;
    }

    public void setOperand1(Double operand1) {
        this.operand1 = operand1;
    }

    public String getOperator() {
        return operator;
    }

    public void setOperator(String operator) {
        this.operator = operator;
    }

    public Double getOperand2() {
        return operand2;
    }

    public void setOperand2(Double operand2) {
        this.operand2 = operand2;
    }

    public String getExpression() {
        return expression;
    }

    public void setExpression(String expression) {
        this.expression = expression;
    }

    public Double getResult() {
        return result;
    }

    public void setResult(Double result) {
        this.result = result;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
