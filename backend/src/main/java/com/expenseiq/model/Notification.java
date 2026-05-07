package com.expenseiq.model;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Notification {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String type;
    private String message;
    @Enumerated(EnumType.STRING)
    private NotificationStatus status;
    private LocalDateTime createdAt;
    @ManyToOne @JoinColumn(name = "user_id")
    private User user;
    @PrePersist
    protected void onCreate() { this.createdAt = LocalDateTime.now(); }
}
