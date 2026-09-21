package com.calculator.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "calculations")
public class CalculationRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "operand1", nullable = false)
    private Double operand1;

    @Column(name = "operator", nullable = false, length = 10)
    private String operator;

    @Column(name = "operand2")
    private Double operand2;

    @Column(name = "expression", nullable = false, length = 100)
    private String expression;

    @Column(name = "result", nullable = false)
    private Double result;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    public CalculationRecord() {
    }

    public CalculationRecord(Double operand1, String operator, Double operand2, String expression, Double result) {
        this.operand1 = operand1;
        this.operator = operator;
        this.operand2 = operand2;
        this.expression = expression;
        this.result = result;
        this.createdAt = LocalDateTime.now();
    }

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
    }

    // Getters and Setters
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
}
