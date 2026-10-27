const BASE_URL = '/api/auth';

export const authApi = {
  getToken: () => localStorage.getItem('expense_tracker_token'),

  setToken: (token) => {
    if (token) {
      localStorage.setItem('expense_tracker_token', token);
    } else {
      localStorage.removeItem('expense_tracker_token');
    }
  },

  getCurrentUserFromStorage: () => {
    const raw = localStorage.getItem('expense_tracker_user');
    return raw ? JSON.parse(raw) : null;
  },

  setCurrentUserToStorage: (user) => {
    if (user) {
      localStorage.setItem('expense_tracker_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('expense_tracker_user');
    }
  },

  register: async (userData) => {
    const response = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }
    authApi.setToken(data.token);
    authApi.setCurrentUserToStorage({
      id: data.id,
      username: data.username,
      email: data.email,
    });
    return data;
  },

  login: async (credentials) => {
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }
    authApi.setToken(data.token);
    authApi.setCurrentUserToStorage({
      id: data.id,
      username: data.username,
      email: data.email,
    });
    return data;
  },

  getProfile: async () => {
    const token = authApi.getToken();
    if (!token) return null;
    const response = await fetch(`${BASE_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      authApi.logout();
      return null;
    }
    return response.json();
  },

  logout: async () => {
    const token = authApi.getToken();
    if (token) {
      try {
        await fetch(`${BASE_URL}/logout`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch {
        // ignore network error on logout
      }
    }
    authApi.setToken(null);
    authApi.setCurrentUserToStorage(null);
  },
};

