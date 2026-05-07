package com.expenseiq.model;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "budgets")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Budget {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private BigDecimal amount;
    private String month;
    @ManyToOne @JoinColumn(name = "category_id")
    private Category category;
    @ManyToOne @JoinColumn(name = "user_id")
    private User user;
}
