package com.expensetracker;

import com.expensetracker.dto.ExpenseRequest;
import com.expensetracker.dto.LoginRequest;
import com.expensetracker.dto.RegisterRequest;
import com.expensetracker.model.Category;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class ExpenseTrackerApplicationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void contextLoads() {
    }

    @Test
    void shouldRegisterAndLoginUser() throws Exception {
        String uniqueUser = "testuser_" + System.currentTimeMillis();
        RegisterRequest registerReq = new RegisterRequest(
                uniqueUser,
                uniqueUser + "@example.com",
                "secret123"
        );

        String regResp = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerReq)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.token", notNullValue()))
                .andExpect(jsonPath("$.username", is(uniqueUser)))
                .andReturn().getResponse().getContentAsString();

        String token = com.jayway.jsonpath.JsonPath.read(regResp, "$.token");

        // Verify login
        LoginRequest loginReq = new LoginRequest(uniqueUser, "secret123");
        String loginResp = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token", notNullValue()))
                .andExpect(jsonPath("$.username", is(uniqueUser)))
                .andReturn().getResponse().getContentAsString();

        token = com.jayway.jsonpath.JsonPath.read(loginResp, "$.token");

        // User adds their private expense
        ExpenseRequest expenseReq = new ExpenseRequest(
                "Private User Expense",
                new BigDecimal("77.50"),
                Category.TRAVEL,
                LocalDate.now()
        );

        mockMvc.perform(post("/api/expenses")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(expenseReq)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title", is("Private User Expense")));

        // User gets only their expenses
        mockMvc.perform(get("/api/expenses")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].title", is("Private User Expense")));
    }

    @Test
    void shouldGetAllExpenses() throws Exception {
        mockMvc.perform(get("/api/expenses"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", notNullValue()));
    }

    @Test
    void shouldGetSummary() throws Exception {
        mockMvc.perform(get("/api/expenses/summary"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalAmount", notNullValue()))
                .andExpect(jsonPath("$.totalCount", greaterThanOrEqualTo(0)))
                .andExpect(jsonPath("$.categoryBreakdown", notNullValue()));
    }

    @Test
    void shouldCreateExpenseSuccessfully() throws Exception {
        ExpenseRequest request = new ExpenseRequest(
                "Coffee & Snack",
                new BigDecimal("6.75"),
                Category.FOOD,
                LocalDate.now()
        );

        mockMvc.perform(post("/api/expenses")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", notNullValue()))
                .andExpect(jsonPath("$.title", is("Coffee & Snack")))
                .andExpect(jsonPath("$.amount", is(6.75)))
                .andExpect(jsonPath("$.category", is("Food")));
    }

    @Test
    void shouldRejectEmptyTitle() throws Exception {
        ExpenseRequest request = new ExpenseRequest(
                "",
                new BigDecimal("20.00"),
                Category.FOOD,
                LocalDate.now()
        );

        mockMvc.perform(post("/api/expenses")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", containsString("Title")));
    }

    @Test
    void shouldRejectZeroAmount() throws Exception {
        ExpenseRequest request = new ExpenseRequest(
                "Free sample",
                new BigDecimal("0.00"),
                Category.OTHER,
                LocalDate.now()
        );

        mockMvc.perform(post("/api/expenses")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", containsString("greater than zero")));
    }

    @Test
    void shouldRejectNegativeAmount() throws Exception {
        ExpenseRequest request = new ExpenseRequest(
                "Refund test",
                new BigDecimal("-15.50"),
                Category.SHOPPING,
                LocalDate.now()
        );

        mockMvc.perform(post("/api/expenses")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", containsString("greater than zero")));
    }

    @Test
    void shouldUpdateExpense() throws Exception {
        ExpenseRequest createReq = new ExpenseRequest(
                "Book to read",
                new BigDecimal("15.00"),
                Category.OTHER,
                LocalDate.now()
        );

        String responseStr = mockMvc.perform(post("/api/expenses")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createReq)))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();

        Number id = com.jayway.jsonpath.JsonPath.read(responseStr, "$.id");

        ExpenseRequest updateReq = new ExpenseRequest(
                "Advanced Java Book",
                new BigDecimal("24.50"),
                Category.OTHER,
                LocalDate.now()
        );

        mockMvc.perform(put("/api/expenses/" + id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title", is("Advanced Java Book")))
                .andExpect(jsonPath("$.amount", is(24.50)));
    }

    @Test
    void shouldDeleteExpense() throws Exception {
        ExpenseRequest createReq = new ExpenseRequest(
                "Accidental Entry",
                new BigDecimal("5.00"),
                Category.OTHER,
                LocalDate.now()
        );

        String responseStr = mockMvc.perform(post("/api/expenses")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createReq)))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();

        Number id = com.jayway.jsonpath.JsonPath.read(responseStr, "$.id");

        mockMvc.perform(delete("/api/expenses/" + id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", containsString("deleted successfully")));

        mockMvc.perform(get("/api/expenses/" + id))
                .andExpect(status().isNotFound());
    }

    @Test
    void shouldFilterByCategory() throws Exception {
        mockMvc.perform(get("/api/expenses?category=Food"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[*].category", everyItem(is("Food"))));
    }
}
