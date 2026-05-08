package com.expenseiq.dto;

import com.expenseiq.model.InsightSeverity;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data @AllArgsConstructor
public class InsightDTO {
    private String title;
    private String description;
    private InsightSeverity severity;
}
