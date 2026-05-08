package com.expenseiq.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data @AllArgsConstructor
public class BudgetProgressDTO {
    private String categoryName;
    private BigDecimal limit;
    private BigDecimal spent;
    private Double percentage;
    private String color;
}
