package com.expenseiq.service;

import com.expenseiq.dto.CategoryDTO;
import com.expenseiq.model.Category;
import com.expenseiq.model.Expense;
import com.expenseiq.repository.CategoryRepository;
import com.expenseiq.repository.ExpenseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository categoryRepository;
    private final ExpenseRepository expenseRepository;

    private CategoryDTO toDTO(Category c) {
        return new CategoryDTO(c.getId(), c.getName(), c.getColor(), c.getIcon());
    }

    public List<CategoryDTO> getAllCategories() {
        return categoryRepository.findAllByOrderByNameAsc()
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public CategoryDTO createCategory(CategoryDTO dto) {
        if (categoryRepository.findByName(dto.getName()).isPresent()) {
            throw new RuntimeException("DUPLICATE_NAME");
        }
        Category category = Category.builder()
                .name(dto.getName())
                .color(dto.getColor())
                .icon(dto.getIcon())
                .build();
        return toDTO(categoryRepository.save(category));
    }

    public CategoryDTO updateCategory(Long id, CategoryDTO dto) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        // Check for duplicate name (excluding self)
        categoryRepository.findByName(dto.getName()).ifPresent(existing -> {
            if (!existing.getId().equals(id)) throw new RuntimeException("DUPLICATE_NAME");
        });
        category.setName(dto.getName());
        category.setColor(dto.getColor());
        category.setIcon(dto.getIcon());
        return toDTO(categoryRepository.save(category));
    }

    @Transactional
    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        // Safe delete: set expense.category = null instead of cascade-deleting
        List<Expense> linkedExpenses = expenseRepository.findByCategory(category);
        linkedExpenses.forEach(e -> e.setCategory(null));
        expenseRepository.saveAll(linkedExpenses);
        categoryRepository.delete(category);
    }
}
