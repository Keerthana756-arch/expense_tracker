package com.expensetracker.dto;

import java.math.BigDecimal;
import java.util.Map;

public class ExpenseSummary {

    private BigDecimal totalAmount;
    private long totalCount;
    private Map<String, BigDecimal> categoryBreakdown;

    public ExpenseSummary() {
    }

    public ExpenseSummary(BigDecimal totalAmount, long totalCount, Map<String, BigDecimal> categoryBreakdown) {
        this.totalAmount = totalAmount;
        this.totalCount = totalCount;
        this.categoryBreakdown = categoryBreakdown;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public long getTotalCount() {
        return totalCount;
    }

    public void setTotalCount(long totalCount) {
        this.totalCount = totalCount;
    }

    public Map<String, BigDecimal> getCategoryBreakdown() {
        return categoryBreakdown;
    }

    public void setCategoryBreakdown(Map<String, BigDecimal> categoryBreakdown) {
        this.categoryBreakdown = categoryBreakdown;
    }
}

