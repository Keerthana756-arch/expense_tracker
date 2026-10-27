package com.expensetracker.service.impl;

import com.expensetracker.dto.ExpenseRequest;
import com.expensetracker.dto.ExpenseResponse;
import com.expensetracker.dto.ExpenseSummary;
import com.expensetracker.exception.ResourceNotFoundException;
import com.expensetracker.model.Category;
import com.expensetracker.model.Expense;
import com.expensetracker.model.User;
import com.expensetracker.repository.ExpenseRepository;
import com.expensetracker.repository.UserRepository;
import com.expensetracker.service.AuthService;
import com.expensetracker.service.ExpenseService;
import com.expensetracker.util.PasswordUtil;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
public class ExpenseServiceImpl implements ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;
    private final AuthService authService;

    public ExpenseServiceImpl(ExpenseRepository expenseRepository, UserRepository userRepository, AuthService authService) {
        this.expenseRepository = expenseRepository;
        this.userRepository = userRepository;
        this.authService = authService;
    }

    private User getOrCreateUser(String token) {
        if (token != null && !token.trim().isEmpty()) {
            return authService.resolveUser(token);
        }
        return userRepository.findByUsernameIgnoreCase("demo").orElseGet(() -> {
            String salt = PasswordUtil.generateSalt();
            String hash = PasswordUtil.hashPassword("demo123", salt);
            User demo = new User("demo", "demo@expensetracker.com", hash, salt);
            demo.setSessionToken("demo-token");
            return userRepository.save(demo);
        });
    }

    @Override
    @Transactional(readOnly = true)
    public List<ExpenseResponse> getAllExpenses(Category category, String token) {
        User user = getOrCreateUser(token);
        List<Expense> expenses;
        if (category != null) {
            expenses = expenseRepository.findByUserIdAndCategoryOrderByDateDescCreatedAtDesc(user.getId(), category);
        } else {
            expenses = expenseRepository.findByUserIdOrderByDateDescCreatedAtDesc(user.getId());
        }
        return expenses.stream()
                .map(ExpenseResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ExpenseResponse getExpenseById(Long id, String token) {
        User user = getOrCreateUser(token);
        Expense expense = expenseRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found with ID: " + id));
        return ExpenseResponse.fromEntity(expense);
    }

    @Override
    public ExpenseResponse createExpense(ExpenseRequest request, String token) {
        validateRequest(request);
        User user = getOrCreateUser(token);

        Expense expense = new Expense();
        expense.setTitle(request.getTitle().trim());
        expense.setAmount(request.getAmount());
        expense.setCategory(request.getCategory() != null ? request.getCategory() : Category.OTHER);
        expense.setDate(request.getDate() != null ? request.getDate() : LocalDate.now());
        expense.setUser(user);

        Expense saved = expenseRepository.save(expense);
        return ExpenseResponse.fromEntity(saved);
    }

    @Override
    public ExpenseResponse updateExpense(Long id, ExpenseRequest request, String token) {
        validateRequest(request);
        User user = getOrCreateUser(token);

        Expense expense = expenseRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found with ID: " + id));

        expense.setTitle(request.getTitle().trim());
        expense.setAmount(request.getAmount());
        expense.setCategory(request.getCategory() != null ? request.getCategory() : Category.OTHER);
        expense.setDate(request.getDate() != null ? request.getDate() : LocalDate.now());

        Expense updated = expenseRepository.save(expense);
        return ExpenseResponse.fromEntity(updated);
    }

    @Override
    public void deleteExpense(Long id, String token) {
        User user = getOrCreateUser(token);
        Expense expense = expenseRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found with ID: " + id));
        expenseRepository.delete(expense);
    }

    @Override
    @Transactional(readOnly = true)
    public ExpenseSummary getSummary(String token) {
        User user = getOrCreateUser(token);
        List<Expense> userExpenses = expenseRepository.findByUserId(user.getId());

        BigDecimal total = userExpenses.stream()
                .map(Expense::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, BigDecimal> breakdown = new LinkedHashMap<>();
        for (Category cat : Category.values()) {
            breakdown.put(cat.getDisplayName(), BigDecimal.ZERO);
        }

        for (Expense exp : userExpenses) {
            String catName = exp.getCategory().getDisplayName();
            breakdown.put(catName, breakdown.getOrDefault(catName, BigDecimal.ZERO).add(exp.getAmount()));
        }

        return new ExpenseSummary(total, userExpenses.size(), breakdown);
    }

    private void validateRequest(ExpenseRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Expense payload cannot be null");
        }
        if (request.getTitle() == null || request.getTitle().trim().isEmpty()) {
            throw new IllegalArgumentException("Title is required and cannot be empty");
        }
        if (request.getAmount() == null) {
            throw new IllegalArgumentException("Amount is required");
        }
        if (request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Amount must be greater than zero");
        }
    }
}
