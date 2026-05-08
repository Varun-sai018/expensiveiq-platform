package com.expenseiq.controller;

import com.expenseiq.dto.BudgetDTO;
import com.expenseiq.dto.BudgetUtilizationDTO;
import com.expenseiq.model.User;
import com.expenseiq.service.BudgetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/budgets")
@RequiredArgsConstructor
public class BudgetController {
    private final BudgetService budgetService;

    @GetMapping("/utilization")
    public ResponseEntity<List<BudgetUtilizationDTO>> getBudgetUtilization(
            @AuthenticationPrincipal User user,
            @RequestParam(defaultValue = "") String month) {
        if (month == null || month.isEmpty()) {
            month = java.time.YearMonth.now().toString();
        }
        return ResponseEntity.ok(budgetService.getBudgetsWithUtilization(user, month));
    }

    @PostMapping
    public ResponseEntity<BudgetDTO> createBudget(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody BudgetDTO dto) {
        return ResponseEntity.ok(budgetService.createOrUpdateBudget(user, dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BudgetDTO> updateBudget(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @Valid @RequestBody BudgetDTO dto) {
        dto.setId(id);
        return ResponseEntity.ok(budgetService.createOrUpdateBudget(user, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBudget(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        budgetService.deleteBudget(user, id);
        return ResponseEntity.noContent().build();
    }
}
