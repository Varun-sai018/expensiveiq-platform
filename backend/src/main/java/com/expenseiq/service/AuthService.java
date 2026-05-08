package com.expenseiq.service;

import com.expenseiq.dto.AuthRequest;
import com.expenseiq.dto.AuthResponse;
import com.expenseiq.dto.SignupRequest;
import com.expenseiq.model.Role;
import com.expenseiq.model.User;
import com.expenseiq.repository.UserRepository;
import com.expenseiq.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final EmailService emailService;

    // When true, users are auto-verified on signup (no email needed)
    // Set to false in production once a real mail server is configured
    @Value("${app.skip-email-verification:true}")
    private boolean skipEmailVerification;

    public void signup(SignupRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("EMAIL_EXISTS");
        }

        String verificationToken = UUID.randomUUID().toString();

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                // Auto-verify if no email server configured; require verification otherwise
                .isVerified(skipEmailVerification)
                .verificationToken(skipEmailVerification ? null : verificationToken)
                .build();
        userRepository.save(user);

        if (skipEmailVerification) {
            System.out.println("LOCAL DEV — Email verification SKIPPED. User '" + request.getEmail() + "' is auto-verified and can login immediately.");
        } else {
            String verifyUrl = "http://localhost:5173/verify-email?token=" + verificationToken;
            System.out.println("LOCAL DEV — Verification URL: " + verifyUrl);
            emailService.sendEmail(user.getEmail(), "Verify your ExpenseIQ account",
                    "Click to verify: " + verifyUrl);
        }
    }

    public AuthResponse login(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (!user.isVerified()) throw new RuntimeException("EMAIL_NOT_VERIFIED");
        String jwtToken = jwtUtil.generateToken(user.getEmail());
        return new AuthResponse(jwtToken, user.getName(), user.getEmail(), user.getRole());
    }

    public void verifyEmail(String token) {
        User user = userRepository.findByVerificationToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid or already used token"));
        user.setVerified(true);
        user.setVerificationToken(null);
        userRepository.save(user);
    }

    public void forgotPassword(String email) {
        userRepository.findByEmail(email).ifPresent(user -> {
            String resetToken = UUID.randomUUID().toString();
            user.setResetToken(resetToken);
            user.setResetTokenExpiry(LocalDateTime.now().plusHours(1));
            userRepository.save(user);
            String resetUrl = "http://localhost:5173/reset-password?token=" + resetToken;
            System.out.println("LOCAL DEV — Password Reset URL: " + resetUrl);
            emailService.sendEmail(user.getEmail(), "Reset your ExpenseIQ password",
                    "Click to reset: " + resetUrl);
        });
    }

    public void resetPassword(String token, String newPassword) {
        User user = userRepository.findByResetToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid or expired reset token"));
        if (user.getResetTokenExpiry() == null ||
                user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Reset token has expired");
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepository.save(user);
    }
}
