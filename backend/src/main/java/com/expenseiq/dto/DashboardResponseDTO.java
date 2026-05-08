package com.expenseiq.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data @Builder
public class DashboardResponseDTO {
    private BigDecimal totalExpenses;
    private BigDecimal remainingBudget;
    private Integer financialScore;
    private BigDecimal savingsProgress;
    private List<CategoryBreakdownDTO> categoryBreakdown;
    private List<MonthlyTrendDTO> monthlyTrend;
    private List<InsightDTO> insights;
    private List<ExpenseDTO> recentTransactions;
}
