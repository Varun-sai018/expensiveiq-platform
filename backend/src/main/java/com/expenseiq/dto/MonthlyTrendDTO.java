package com.expenseiq.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data @AllArgsConstructor
public class MonthlyTrendDTO {
    private String date;
    private BigDecimal amount;
}
