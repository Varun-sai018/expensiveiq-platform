package com.expenseiq.dto;
import lombok.Data;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class ExpenseRequestDTO {
    @NotNull private BigDecimal amount;
    private String description;
    @NotNull private LocalDate date;
    private Long categoryId;
    private boolean isRecurring;
    private String recurrenceInterval;
}
