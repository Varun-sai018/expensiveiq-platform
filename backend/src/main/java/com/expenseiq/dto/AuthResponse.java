package com.expenseiq.dto;
import lombok.AllArgsConstructor;
import lombok.Data;
import com.expenseiq.model.Role;

@Data @AllArgsConstructor
public class AuthResponse {
    private String token;
    private String name;
    private String email;
    private Role role;
}
