package com.expenseiq.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class BudgetUtilizationDTO {
    private Long budgetId;
    private BigDecimal limit;
    private BigDecimal spent;
    private Double utilizationPercentage;
    private String categoryName; // "Overall" if no category
    private boolean exceeded;
}
