package com.expenseiq.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.YearMonth;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class BudgetDTO {
    private Long id;

    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    private BigDecimal amount;

    private String month; // format: "YYYY-MM"
    
    private Long categoryId; // null means overall budget
    private String categoryName;
}
