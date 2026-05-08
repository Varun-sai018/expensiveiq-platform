package com.expenseiq.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ExpenseResponseDTO {
    private Long id;
    private BigDecimal amount;
    private String description;
    private LocalDate date;
    private boolean isRecurring;
    private String recurrenceInterval;

    // Flat category fields for easy frontend use
    private Long categoryId;
    private String categoryName;
    private String categoryColor;
    private String categoryIcon;
}
