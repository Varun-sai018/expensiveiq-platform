package com.expenseiq.model;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "expenses")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Expense {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private BigDecimal amount;
    private String description;
    private LocalDate date;
    @ManyToOne @JoinColumn(name = "category_id")
    private Category category;
    @ManyToOne @JoinColumn(name = "user_id")
    private User user;
    private boolean isRecurring;
    private String recurrenceInterval;
}
