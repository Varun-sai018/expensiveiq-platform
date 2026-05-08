package com.expenseiq.service;

import com.expenseiq.dto.*;
import com.expenseiq.model.*;
import com.expenseiq.repository.ExpenseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {
    private final ExpenseRepository expenseRepository;

    public DashboardResponseDTO getDashboardData(User user) {
        LocalDate startOfMonth = LocalDate.now().withDayOfMonth(1);
        LocalDate endOfMonth = LocalDate.now().withDayOfMonth(LocalDate.now().lengthOfMonth());
        
        // Placeholders for now, will be implemented fully later
        return DashboardResponseDTO.builder()
                .totalExpenses(BigDecimal.valueOf(1500.00))
                .remainingBudget(BigDecimal.valueOf(500.00))
                .financialScore(75)
                .savingsProgress(BigDecimal.valueOf(65.0))
                .categoryBreakdown(List.of(
                        new CategoryBreakdownDTO("Food", BigDecimal.valueOf(500), "#FF8042"),
                        new CategoryBreakdownDTO("Rent", BigDecimal.valueOf(1000), "#00C49F")
                ))
                .monthlyTrend(List.of(
                        new MonthlyTrendDTO("01", BigDecimal.valueOf(50)),
                        new MonthlyTrendDTO("02", BigDecimal.valueOf(100))
                ))
                .insights(List.of(
                        new InsightDTO("High spending in Food", "You have spent 50% of your budget in Food.", InsightSeverity.WARNING)
                ))
                .recentTransactions(new ArrayList<>())
                .build();
    }
}
