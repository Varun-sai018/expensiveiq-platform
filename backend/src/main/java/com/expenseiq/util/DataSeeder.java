package com.expenseiq.util;

import com.expenseiq.model.Category;
import com.expenseiq.repository.CategoryRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private final CategoryRepository categoryRepository;

    public DataSeeder(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (categoryRepository.count() == 0) {
            List<Category> defaultCategories = Arrays.asList(
                    Category.builder().name("Food").color("#FF5733").icon("Utensils").build(),
                    Category.builder().name("Transport").color("#3380FF").icon("Car").build(),
                    Category.builder().name("Housing").color("#33FF57").icon("Home").build(),
                    Category.builder().name("Entertainment").color("#E033FF").icon("Film").build(),
                    Category.builder().name("Health").color("#FF336E").icon("HeartPulse").build(),
                    Category.builder().name("Shopping").color("#FFC733").icon("ShoppingBag").build(),
                    Category.builder().name("Subscriptions").color("#33FFE9").icon("CreditCard").build(),
                    Category.builder().name("Other").color("#808080").icon("MoreHorizontal").build()
            );

            categoryRepository.saveAll(defaultCategories);
            System.out.println("Default categories have been seeded.");
        }
    }
}
