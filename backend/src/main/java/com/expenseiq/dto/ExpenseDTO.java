package com.expenseiq.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ExpenseDTO {
    private Long id;
    private BigDecimal amount;
    private String description;
    private LocalDate expenseDate;
    private String categoryName;
    private String categoryColor;
}
