package com.expenseiq.service;

import com.expenseiq.dto.BudgetDTO;
import com.expenseiq.dto.BudgetUtilizationDTO;
import com.expenseiq.model.User;
import com.expenseiq.repository.BudgetRepository;
import com.expenseiq.repository.ExpenseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class BudgetService {
    private final BudgetRepository budgetRepository;
    private final ExpenseRepository expenseRepository;

    public List<BudgetUtilizationDTO> getBudgetsWithUtilization(User user, String month) {
        // Placeholders. We would query BudgetRepository and ExpenseRepository to calculate utilization.
        return List.of(
                new BudgetUtilizationDTO(1L, BigDecimal.valueOf(3000), BigDecimal.valueOf(2450.75), 81.6, "Overall", false),
                new BudgetUtilizationDTO(2L, BigDecimal.valueOf(500), BigDecimal.valueOf(600), 120.0, "Food", true),
                new BudgetUtilizationDTO(3L, BigDecimal.valueOf(800), BigDecimal.valueOf(550.75), 68.8, "Entertainment", false)
        );
    }

    public BudgetDTO createOrUpdateBudget(User user, BudgetDTO dto) {
        // Validation logic to prevent multiple overall budgets per month
        // or multiple budgets for the same category in the same month.
        // Return dummy response for now.
        dto.setId(10L);
        return dto;
    }

    public void deleteBudget(User user, Long budgetId) {
        // budgetRepository.deleteByIdAndUser(budgetId, user);
    }
}
