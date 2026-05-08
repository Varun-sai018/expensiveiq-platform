package com.expenseiq.service;

import com.expenseiq.dto.*;
import com.expenseiq.model.User;
import com.expenseiq.repository.ExpenseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.YearMonth;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AnalyticsService {
    private final ExpenseRepository expenseRepository;

    public AnalyticsResponseDTO getAnalyticsData(User user, String month) {
        YearMonth yearMonth = YearMonth.parse(month); // e.g. "2024-05"
        
        // Placeholders, will be replaced with real JPA Queries in future
        return AnalyticsResponseDTO.builder()
                .totalSpent(BigDecimal.valueOf(2450.75))
                .averageDailySpend(BigDecimal.valueOf(116.70))
                .projectedSpend(BigDecimal.valueOf(3200.00))
                .previousMonthSpend(BigDecimal.valueOf(2100.00))
                .monthOverMonthChange(16.7)
                .categoryDistribution(List.of(
                        new CategoryBreakdownDTO("Housing", BigDecimal.valueOf(1000), "#4F46E5"),
                        new CategoryBreakdownDTO("Food", BigDecimal.valueOf(600), "#10B981"),
                        new CategoryBreakdownDTO("Transport", BigDecimal.valueOf(300), "#F59E0B"),
                        new CategoryBreakdownDTO("Entertainment", BigDecimal.valueOf(550.75), "#EC4899")
                ))
                .dailySpending(List.of(
                        new MonthlyTrendDTO("01", BigDecimal.valueOf(150)),
                        new MonthlyTrendDTO("05", BigDecimal.valueOf(60)),
                        new MonthlyTrendDTO("10", BigDecimal.valueOf(300)),
                        new MonthlyTrendDTO("15", BigDecimal.valueOf(45)),
                        new MonthlyTrendDTO("20", BigDecimal.valueOf(120))
                ))
                .budgetProgress(List.of(
                        new BudgetProgressDTO("Overall", BigDecimal.valueOf(3000), BigDecimal.valueOf(2450.75), 81.6, "#EF4444"),
                        new BudgetProgressDTO("Food", BigDecimal.valueOf(500), BigDecimal.valueOf(600), 120.0, "#EF4444"),
                        new BudgetProgressDTO("Entertainment", BigDecimal.valueOf(800), BigDecimal.valueOf(550.75), 68.8, "#F59E0B")
                ))
                .build();
    }
}
