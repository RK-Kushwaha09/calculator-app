package com.calculator.dto;

public class CalculateRequest {
    private Double operand1;
    private String operator;
    private Double operand2;
    private String expression;

    public CalculateRequest() {}

    public CalculateRequest(Double operand1, String operator, Double operand2, String expression) {
        this.operand1 = operand1;
        this.operator = operator;
        this.operand2 = operand2;
        this.expression = expression;
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
}
