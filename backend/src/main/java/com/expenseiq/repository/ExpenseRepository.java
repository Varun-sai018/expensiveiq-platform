package com.expenseiq.repository;
import com.expenseiq.model.Category;
import com.expenseiq.model.Expense;
import com.expenseiq.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long>, JpaSpecificationExecutor<Expense> {
    List<Expense> findByUserAndIsRecurringTrue(User user);
    List<Expense> findByCategory(Category category);
}
