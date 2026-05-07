package com.expenseiq.service;
import com.expenseiq.dto.AuthRequest;
import com.expenseiq.dto.AuthResponse;
import com.expenseiq.dto.SignupRequest;
import com.expenseiq.model.Role;
import com.expenseiq.model.User;
import com.expenseiq.model.VerificationToken;
import com.expenseiq.repository.UserRepository;
import com.expenseiq.repository.VerificationTokenRepository;
import com.expenseiq.security.JwtUtil;
import lombok.RequiredArgsConstructor;
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
    private final VerificationTokenRepository verificationTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final EmailService emailService;

    public void signup(SignupRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) throw new RuntimeException("Email already in use");
        User user = User.builder().name(request.getName()).email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword())).role(Role.USER).isVerified(false).build();
        userRepository.save(user);
        String token = UUID.randomUUID().toString();
        VerificationToken verificationToken = VerificationToken.builder().token(token).user(user).expiryDate(LocalDateTime.now().plusHours(24)).build();
        verificationTokenRepository.save(verificationToken);
        emailService.sendEmail(user.getEmail(), "Verify your ExpenseIQ account", "Click to verify: http://localhost:5173/verify-email?token=" + token);
    }

    public AuthResponse login(AuthRequest request) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        User user = userRepository.findByEmail(request.getEmail()).orElseThrow(() -> new RuntimeException("User not found"));
        if (!user.isVerified()) throw new RuntimeException("Please verify your email first");
        String jwtToken = jwtUtil.generateToken(user.getEmail());
        return new AuthResponse(jwtToken, user.getName(), user.getEmail(), user.getRole());
    }

    public void verifyEmail(String token) {
        VerificationToken vToken = verificationTokenRepository.findByToken(token).orElseThrow(() -> new RuntimeException("Invalid token"));
        if (vToken.getExpiryDate().isBefore(LocalDateTime.now())) throw new RuntimeException("Token expired");
        User user = vToken.getUser();
        user.setVerified(true);
        userRepository.save(user);
        verificationTokenRepository.delete(vToken);
    }
}
