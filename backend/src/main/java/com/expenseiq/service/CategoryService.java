package com.expenseiq.service;
import com.expenseiq.dto.CategoryDTO;
import com.expenseiq.model.Category;
import com.expenseiq.model.Expense;
import com.expenseiq.repository.CategoryRepository;
import com.expenseiq.repository.ExpenseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository categoryRepository;
    private final ExpenseRepository expenseRepository;

    public List<CategoryDTO> getAllCategories() {
        return categoryRepository.findAll().stream().map(c -> new CategoryDTO(c.getId(), c.getName(), c.getColor(), c.getIcon())).collect(Collectors.toList());
    }

    public CategoryDTO createCategory(CategoryDTO dto) {
        if (categoryRepository.findByName(dto.getName()).isPresent()) throw new RuntimeException("Category already exists");
        Category category = Category.builder().name(dto.getName()).color(dto.getColor()).icon(dto.getIcon()).build();
        category = categoryRepository.save(category);
        return new CategoryDTO(category.getId(), category.getName(), category.getColor(), category.getIcon());
    }

    public CategoryDTO updateCategory(Long id, CategoryDTO dto) {
        Category category = categoryRepository.findById(id).orElseThrow(() -> new RuntimeException("Category not found"));
        category.setName(dto.getName());
        category.setColor(dto.getColor());
        category.setIcon(dto.getIcon());
        category = categoryRepository.save(category);
        return new CategoryDTO(category.getId(), category.getName(), category.getColor(), category.getIcon());
    }

    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id).orElseThrow(() -> new RuntimeException("Category not found"));
        List<Expense> expenses = expenseRepository.findByCategory(category);
        expenses.forEach(e -> e.setCategory(null));
        expenseRepository.saveAll(expenses);
        categoryRepository.delete(category);
    }
}
