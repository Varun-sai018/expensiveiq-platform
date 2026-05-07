package com.expenseiq.controller;
import com.expenseiq.dto.ExpenseRequestDTO;
import com.expenseiq.dto.ExpenseResponseDTO;
import com.expenseiq.service.ExpenseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
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
            Pageable pageable) {
        return ResponseEntity.ok(expenseService.getExpenses(authentication.getName(), categoryId, startDate, endDate, search, pageable));
    }

    @PostMapping
    public ResponseEntity<ExpenseResponseDTO> createExpense(Authentication authentication, @Valid @RequestBody ExpenseRequestDTO dto) {
        return ResponseEntity.ok(expenseService.createExpense(authentication.getName(), dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ExpenseResponseDTO> updateExpense(Authentication authentication, @PathVariable Long id, @Valid @RequestBody ExpenseRequestDTO dto) {
        return ResponseEntity.ok(expenseService.updateExpense(authentication.getName(), id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExpense(Authentication authentication, @PathVariable Long id) {
        expenseService.deleteExpense(authentication.getName(), id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/recurring")
    public ResponseEntity<List<ExpenseResponseDTO>> getRecurringExpenses(Authentication authentication) {
        return ResponseEntity.ok(expenseService.getRecurringExpenses(authentication.getName()));
    }
}
