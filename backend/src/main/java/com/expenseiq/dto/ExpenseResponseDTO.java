package com.expenseiq.dto;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data @Builder
public class ExpenseResponseDTO {
    private Long id;
    private BigDecimal amount;
    private String description;
    private LocalDate date;
    private CategoryDTO category;
    private boolean isRecurring;
    private String recurrenceInterval;
}
