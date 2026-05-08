package com.expenseiq.service;

import com.expenseiq.dto.ExpenseRequestDTO;
import com.expenseiq.dto.ExpenseResponseDTO;
import com.expenseiq.model.Category;
import com.expenseiq.model.Expense;
import com.expenseiq.model.User;
import com.expenseiq.repository.CategoryRepository;
import com.expenseiq.repository.ExpenseRepository;
import com.expenseiq.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import jakarta.persistence.criteria.Predicate;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExpenseService {
    private final ExpenseRepository expenseRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    private ExpenseResponseDTO mapToDTO(Expense e) {
        Category cat = e.getCategory();
        return ExpenseResponseDTO.builder()
                .id(e.getId())
                .amount(e.getAmount())
                .description(e.getDescription())
                .date(e.getDate())
                .isRecurring(e.isRecurring())
                .recurrenceInterval(e.getRecurrenceInterval())
                .categoryId(cat != null ? cat.getId() : null)
                .categoryName(cat != null ? cat.getName() : null)
                .categoryColor(cat != null ? cat.getColor() : null)
                .categoryIcon(cat != null ? cat.getIcon() : null)
                .build();
    }

    public Page<ExpenseResponseDTO> getExpenses(String email, Long categoryId,
            LocalDate startDate, LocalDate endDate, String search, Pageable pageable) {
        User user = userRepository.findByEmail(email).orElseThrow();
        Specification<Expense> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.equal(root.get("user"), user));
            if (categoryId != null)
                predicates.add(cb.equal(root.get("category").get("id"), categoryId));
            if (startDate != null)
                predicates.add(cb.greaterThanOrEqualTo(root.get("date"), startDate));
            if (endDate != null)
                predicates.add(cb.lessThanOrEqualTo(root.get("date"), endDate));
            if (search != null && !search.isEmpty())
                predicates.add(cb.like(cb.lower(root.get("description")), "%" + search.toLowerCase() + "%"));
            return cb.and(predicates.toArray(new Predicate[0]));
        };
        return expenseRepository.findAll(spec, pageable).map(this::mapToDTO);
    }

    public ExpenseResponseDTO getExpenseById(String email, Long id) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Expense not found"));
        if (!expense.getUser().getEmail().equals(email)) {
            throw new AccessDeniedException("You don't have permission to access this expense");
        }
        return mapToDTO(expense);
    }

    public ExpenseResponseDTO createExpense(String email, ExpenseRequestDTO dto) {
        User user = userRepository.findByEmail(email).orElseThrow();
        Category category = dto.getCategoryId() != null
                ? categoryRepository.findById(dto.getCategoryId()).orElse(null) : null;
        Expense expense = Expense.builder()
                .amount(dto.getAmount())
                .description(dto.getDescription())
                .date(dto.getDate())
                .category(category)
                .user(user)
                .isRecurring(dto.isRecurring())
                .recurrenceInterval(dto.getRecurrenceInterval())
                .build();
        return mapToDTO(expenseRepository.save(expense));
    }

    public ExpenseResponseDTO updateExpense(String email, Long id, ExpenseRequestDTO dto) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Expense not found"));
        if (!expense.getUser().getEmail().equals(email)) {
            throw new AccessDeniedException("You don't have permission to modify this expense");
        }
        Category category = dto.getCategoryId() != null
                ? categoryRepository.findById(dto.getCategoryId()).orElse(null) : null;
        expense.setAmount(dto.getAmount());
        expense.setDescription(dto.getDescription());
        expense.setDate(dto.getDate());
        expense.setCategory(category);
        expense.setRecurring(dto.isRecurring());
        expense.setRecurrenceInterval(dto.getRecurrenceInterval());
        return mapToDTO(expenseRepository.save(expense));
    }

    public void deleteExpense(String email, Long id) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Expense not found"));
        if (!expense.getUser().getEmail().equals(email)) {
            throw new AccessDeniedException("You don't have permission to delete this expense");
        }
        expenseRepository.delete(expense);
    }

    public List<ExpenseResponseDTO> getRecurringExpenses(String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        return expenseRepository.findByUserAndIsRecurringTrue(user)
                .stream().map(this::mapToDTO).collect(Collectors.toList());
    }
}
