import { authApi } from './authService';

const BASE_URL = '/api/expenses';

const getHeaders = (extra = {}) => {
  const headers = { ...extra };
  const token = authApi.getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const expenseApi = {
  // Fetch all expenses, optionally filtered by category
  getAllExpenses: async (category = '') => {
    let url = BASE_URL;
    if (category && category !== 'ALL') {
      url += `?category=${encodeURIComponent(category)}`;
    }
    const response = await fetch(url, {
      headers: getHeaders(),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to fetch expenses: ${response.statusText}`);
    }
    return response.json();
  },

  // Fetch expense summary (total spent, count, breakdown)
  getSummary: async () => {
    const response = await fetch(`${BASE_URL}/summary`, {
      headers: getHeaders(),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to fetch expense summary');
    }
    return response.json();
  },

  // Fetch available categories
  getCategories: async () => {
    const response = await fetch(`${BASE_URL}/categories`, {
      headers: getHeaders(),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to fetch categories');
    }
    return response.json();
  },

  // Create a new expense
  createExpense: async (expenseData) => {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: getHeaders({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(expenseData),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create expense');
    }
    return data;
  },

  // Update an existing expense
  updateExpense: async (id, expenseData) => {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: getHeaders({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(expenseData),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update expense');
    }
    return data;
  },

  // Delete an expense
  deleteExpense: async (id) => {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to delete expense');
    }
    return response.json();
  },
};
