package com.expenseiq.model;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "email_logs")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class EmailLog {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String recipient;
    private String subject;
    @Enumerated(EnumType.STRING)
    private EmailStatus status;
    private LocalDateTime sentAt;
    @PrePersist
    protected void onCreate() { this.sentAt = LocalDateTime.now(); }
}
