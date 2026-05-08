package com.expenseiq.controller;

import com.expenseiq.dto.AnalyticsResponseDTO;
import com.expenseiq.model.User;
import com.expenseiq.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {
    private final AnalyticsService analyticsService;

    @GetMapping
    public ResponseEntity<AnalyticsResponseDTO> getAnalytics(
            @AuthenticationPrincipal User user,
            @RequestParam(defaultValue = "") String month) {
        
        if (month == null || month.isEmpty()) {
            month = java.time.YearMonth.now().toString();
        }
        
        return ResponseEntity.ok(analyticsService.getAnalyticsData(user, month));
    }
}
