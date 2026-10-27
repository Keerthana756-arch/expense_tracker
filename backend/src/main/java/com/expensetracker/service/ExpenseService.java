package com.expensetracker.service;

import com.expensetracker.dto.ExpenseRequest;
import com.expensetracker.dto.ExpenseResponse;
import com.expensetracker.dto.ExpenseSummary;
import com.expensetracker.model.Category;

import java.util.List;

public interface ExpenseService {

    List<ExpenseResponse> getAllExpenses(Category category, String token);

    ExpenseResponse getExpenseById(Long id, String token);

    ExpenseResponse createExpense(ExpenseRequest request, String token);

    ExpenseResponse updateExpense(Long id, ExpenseRequest request, String token);

    void deleteExpense(Long id, String token);

    ExpenseSummary getSummary(String token);
}
