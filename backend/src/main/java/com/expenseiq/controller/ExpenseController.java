package com.expenseiq.controller;

import com.expenseiq.dto.ExpenseRequestDTO;
import com.expenseiq.dto.ExpenseResponseDTO;
import com.expenseiq.service.ExpenseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/expenses")
@RequiredArgsConstructor
public class ExpenseController {
    private final ExpenseService expenseService;

    @GetMapping
    public ResponseEntity<Page<ExpenseResponseDTO>> getExpenses(
            Authentication authentication,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("date").descending());
        return ResponseEntity.ok(expenseService.getExpenses(
                authentication.getName(), categoryId, startDate, endDate, search, pageable));
    }

    @PostMapping
    public ResponseEntity<ExpenseResponseDTO> createExpense(
            Authentication authentication,
            @Valid @RequestBody ExpenseRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(expenseService.createExpense(authentication.getName(), dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getExpenseById(Authentication authentication, @PathVariable Long id) {
        try {
            return ResponseEntity.ok(expenseService.getExpenseById(authentication.getName(), id));
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateExpense(
            Authentication authentication,
            @PathVariable Long id,
            @Valid @RequestBody ExpenseRequestDTO dto) {
        try {
            return ResponseEntity.ok(expenseService.updateExpense(authentication.getName(), id, dto));
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExpense(Authentication authentication, @PathVariable Long id) {
        try {
            expenseService.deleteExpense(authentication.getName(), id);
            return ResponseEntity.noContent().build(); // 204
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    @GetMapping("/recurring")
    public ResponseEntity<List<ExpenseResponseDTO>> getRecurringExpenses(Authentication authentication) {
        return ResponseEntity.ok(expenseService.getRecurringExpenses(authentication.getName()));
    }
}
