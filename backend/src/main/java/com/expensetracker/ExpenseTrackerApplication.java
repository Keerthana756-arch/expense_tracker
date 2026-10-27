package com.expensetracker;

import com.expensetracker.model.Category;
import com.expensetracker.model.Expense;
import com.expensetracker.model.User;
import com.expensetracker.repository.ExpenseRepository;
import com.expensetracker.repository.UserRepository;
import com.expensetracker.util.PasswordUtil;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.math.BigDecimal;
import java.time.LocalDate;

@SpringBootApplication
public class ExpenseTrackerApplication {

    public static void main(String[] args) {
        SpringApplication.run(ExpenseTrackerApplication.class, args);
    }

    @Bean
    public CommandLineRunner dataLoader(ExpenseRepository expenseRepository, UserRepository userRepository) {
        return args -> {
            User demoUser = userRepository.findByUsernameIgnoreCase("demo").orElseGet(() -> {
                String salt = PasswordUtil.generateSalt();
                String hash = PasswordUtil.hashPassword("demo123", salt);
                User demo = new User("demo", "demo@expensetracker.com", hash, salt);
                demo.setSessionToken("demo-token");
                return userRepository.save(demo);
            });

            if (expenseRepository.count() == 0) {
                Expense e1 = new Expense(null, "Weekly Groceries", new BigDecimal("125.50"), Category.FOOD, LocalDate.now().minusDays(3));
                e1.setUser(demoUser);
                expenseRepository.save(e1);

                Expense e2 = new Expense(null, "Metro Monthly Pass", new BigDecimal("45.00"), Category.TRAVEL, LocalDate.now().minusDays(2));
                e2.setUser(demoUser);
                expenseRepository.save(e2);

                Expense e3 = new Expense(null, "Running Shoes", new BigDecimal("89.99"), Category.SHOPPING, LocalDate.now().minusDays(1));
                e3.setUser(demoUser);
                expenseRepository.save(e3);

                Expense e4 = new Expense(null, "Internet Bill", new BigDecimal("60.00"), Category.UTILITIES, LocalDate.now());
                e4.setUser(demoUser);
                expenseRepository.save(e4);

                Expense e5 = new Expense(null, "Movie Night Tickets", new BigDecimal("28.00"), Category.ENTERTAINMENT, LocalDate.now());
                e5.setUser(demoUser);
                expenseRepository.save(e5);
            }
        };
    }
}
