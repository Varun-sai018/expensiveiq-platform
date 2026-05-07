package com.expenseiq.model;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "insights")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Insight {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String type;
    private String message;
    @Enumerated(EnumType.STRING)
    private InsightSeverity severity;
    private LocalDateTime createdAt;
    @ManyToOne @JoinColumn(name = "user_id")
    private User user;
    @PrePersist
    protected void onCreate() { this.createdAt = LocalDateTime.now(); }
}
