package com.expenseiq.service;
import com.expenseiq.model.EmailLog;
import com.expenseiq.model.EmailStatus;
import com.expenseiq.repository.EmailLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender mailSender;
    private final EmailLogRepository emailLogRepository;

    @Async
    public void sendEmail(String to, String subject, String text) {
        EmailLog log = EmailLog.builder().recipient(to).subject(subject).status(EmailStatus.FAILED).build();
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);
            mailSender.send(message);
            log.setStatus(EmailStatus.SENT);
        } catch (Exception e) {
            System.err.println("Failed to send email: " + e.getMessage());
        } finally {
            emailLogRepository.save(log);
        }
    }
}
