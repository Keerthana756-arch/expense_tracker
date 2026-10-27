package com.expensetracker.controller;

import com.expensetracker.dto.ExpenseRequest;
import com.expensetracker.dto.ExpenseResponse;
import com.expensetracker.dto.ExpenseSummary;
import com.expensetracker.model.Category;
import com.expensetracker.service.ExpenseService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/expenses")
@CrossOrigin(origins = "*")
public class ExpenseController {

    private final ExpenseService expenseService;

    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    @GetMapping
    public ResponseEntity<List<ExpenseResponse>> getAllExpenses(
            @RequestParam(required = false) String category,
            @RequestHeader(value = "Authorization", required = false) String token) {
        Category catEnum = null;
        if (category != null && !category.trim().isEmpty() && !category.equalsIgnoreCase("ALL")) {
            catEnum = Category.fromString(category);
        }
        List<ExpenseResponse> expenses = expenseService.getAllExpenses(catEnum, token);
        return ResponseEntity.ok(expenses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExpenseResponse> getExpenseById(
            @PathVariable Long id,
            @RequestHeader(value = "Authorization", required = false) String token) {
        ExpenseResponse expense = expenseService.getExpenseById(id, token);
        return ResponseEntity.ok(expense);
    }

    @PostMapping
    public ResponseEntity<ExpenseResponse> createExpense(
            @Valid @RequestBody ExpenseRequest request,
            @RequestHeader(value = "Authorization", required = false) String token) {
        ExpenseResponse created = expenseService.createExpense(request, token);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ExpenseResponse> updateExpense(
            @PathVariable Long id,
            @Valid @RequestBody ExpenseRequest request,
            @RequestHeader(value = "Authorization", required = false) String token) {
        ExpenseResponse updated = expenseService.updateExpense(id, request, token);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteExpense(
            @PathVariable Long id,
            @RequestHeader(value = "Authorization", required = false) String token) {
        expenseService.deleteExpense(id, token);
        return ResponseEntity.ok(Map.of("message", "Expense deleted successfully", "id", id.toString()));
    }

    @GetMapping("/summary")
    public ResponseEntity<ExpenseSummary> getSummary(
            @RequestHeader(value = "Authorization", required = false) String token) {
        ExpenseSummary summary = expenseService.getSummary(token);
        return ResponseEntity.ok(summary);
    }

    @GetMapping("/categories")
    public ResponseEntity<List<Map<String, String>>> getCategories() {
        List<Map<String, String>> categories = Arrays.stream(Category.values())
                .map(c -> Map.of("key", c.name(), "label", c.getDisplayName()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(categories);
    }
}
