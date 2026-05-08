package com.expenseiq.controller;

import com.expenseiq.dto.DashboardResponseDTO;
import com.expenseiq.model.User;
import com.expenseiq.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {
    private final DashboardService dashboardService;

    @GetMapping
    public ResponseEntity<DashboardResponseDTO> getDashboard(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(dashboardService.getDashboardData(user));
    }
}
