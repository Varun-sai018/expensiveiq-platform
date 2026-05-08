package com.expenseiq.model;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(
    name = "expenses",
    indexes = {
        @Index(name = "idx_expense_user_id", columnList = "user_id"),
        @Index(name = "idx_expense_date", columnList = "date"),
        @Index(name = "idx_expense_user_date", columnList = "user_id, date")
    }
)
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Expense {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private BigDecimal amount;

    private String description;

    @Column(nullable = false)
    private LocalDate date;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = true)
    private Category category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "is_recurring")
    private boolean isRecurring;

    private String recurrenceInterval;
}
