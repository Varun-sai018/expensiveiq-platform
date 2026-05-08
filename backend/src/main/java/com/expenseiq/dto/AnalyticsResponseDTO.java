package com.expenseiq.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data @Builder
public class AnalyticsResponseDTO {
    private BigDecimal totalSpent;
    private BigDecimal averageDailySpend;
    private BigDecimal projectedSpend;
    private BigDecimal previousMonthSpend;
    private Double monthOverMonthChange;
    private List<CategoryBreakdownDTO> categoryDistribution;
    private List<MonthlyTrendDTO> dailySpending;
    private List<BudgetProgressDTO> budgetProgress;
}
