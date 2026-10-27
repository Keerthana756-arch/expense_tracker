import React, { useState, useEffect, useMemo, useRef } from 'react';
import Header from './components/Header';
import SummaryCards from './components/SummaryCards';
import ExpenseForm from './components/ExpenseForm';
import ExpenseFilters from './components/ExpenseFilters';
import ExpenseTable from './components/ExpenseTable';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import Toast from './components/Toast';
import AuthPage from './components/AuthPage';
import { expenseApi } from './api/expenseService';
import { authApi } from './api/authService';
import { formatCurrency } from './utils/formatters';
import { RefreshCw } from 'lucide-react';

export default function App() {
  // Auth state
  const [currentUser, setCurrentUser] = useState(() => authApi.getCurrentUserFromStorage());
  const [authChecking, setAuthChecking] = useState(true);

  // Expense state
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState({ totalAmount: 0, totalCount: 0, categoryBreakdown: {} });
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filters & Sorting
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date-desc');

  // Edit & Delete state
  const [editingExpense, setEditingExpense] = useState(null);
  const [deletingExpense, setDeletingExpense] = useState(null);

  // Toast notifications
  const [toast, setToast] = useState(null);

  const formSectionRef = useRef(null);

  const showToast = (type, message, title = '') => {
    setToast({ type, message, title });
  };

  // Verify auth session on initial load
  useEffect(() => {
    const verifyAuth = async () => {
      const token = authApi.getToken();
      if (token) {
        try {
          const profile = await authApi.getProfile();
          if (profile) {
            setCurrentUser(profile);
          } else {
            setCurrentUser(null);
          }
        } catch {
          setCurrentUser(null);
        }
      }
      setAuthChecking(false);
    };
    verifyAuth();
  }, []);

  // Fetch all expenses and summary for the logged-in user
  const loadData = async (cat = selectedCategory) => {
    if (!currentUser) return;
    try {
      setLoading(true);
      const [expensesData, summaryData] = await Promise.all([
        expenseApi.getAllExpenses(cat),
        expenseApi.getSummary(),
      ]);

      setExpenses(expensesData);
      setSummary(summaryData);
    } catch (err) {
      showToast('error', err.message || 'Could not connect to the backend server.', 'Error Loading Data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      loadData(selectedCategory);
    }
  }, [selectedCategory, currentUser]);

  // Handle Login / Registration success
  const handleAuthSuccess = (authData) => {
    setCurrentUser({
      id: authData.id,
      username: authData.username,
      email: authData.email,
    });
    showToast('success', `Welcome back, ${authData.username}!`, 'Signed In');
  };

  // Handle Logout
  const handleLogout = async () => {
    await authApi.logout();
    setCurrentUser(null);
    setExpenses([]);
    setSummary({ totalAmount: 0, totalCount: 0, categoryBreakdown: {} });
    showToast('info', 'You have been signed out successfully.', 'Signed Out');
  };

  // Handle Save (Add or Update)
  const handleSaveExpense = async (payload) => {
    setIsSubmitting(true);
    try {
      if (editingExpense) {
        const updated = await expenseApi.updateExpense(editingExpense.id, payload);
        showToast(
          'success',
          `"${updated.title}" has been updated successfully.`,
          'Expense Updated'
        );
        setEditingExpense(null);
      } else {
        const created = await expenseApi.createExpense(payload);
        showToast(
          'success',
          `"${created.title}" of ${formatCurrency(created.amount)} recorded successfully.`,
          'Expense Added'
        );
      }

      await loadData(selectedCategory);
      return true;
    } catch (err) {
      showToast('error', err.message || 'Failed to save expense.', 'Submission Failed');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Start editing
  const handleEditClick = (expense) => {
    setEditingExpense(expense);
    if (formSectionRef.current) {
      formSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleCancelEdit = () => {
    setEditingExpense(null);
  };

  // Delete Request
  const handleDeleteRequest = (expense) => {
    setDeletingExpense(expense);
  };

  const handleConfirmDelete = async (id) => {
    setIsDeleting(true);
    try {
      await expenseApi.deleteExpense(id);
      showToast('success', 'The expense record was successfully deleted.', 'Expense Deleted');
      setDeletingExpense(null);
      if (editingExpense && editingExpense.id === id) {
        setEditingExpense(null);
      }
      await loadData(selectedCategory);
    } catch (err) {
      showToast('error', err.message || 'Could not delete the expense.', 'Delete Error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter and sort expenses in-memory for instant responsive UI
  const filteredAndSortedExpenses = useMemo(() => {
    let result = [...expenses];

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (exp) =>
          exp.title.toLowerCase().includes(q) ||
          exp.category.toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => {
      if (sortBy === 'date-desc') {
        return new Date(b.date) - new Date(a.date);
      } else if (sortBy === 'date-asc') {
        return new Date(a.date) - new Date(b.date);
      } else if (sortBy === 'amount-desc') {
        return b.amount - a.amount;
      } else if (sortBy === 'amount-asc') {
        return a.amount - b.amount;
      } else if (sortBy === 'title-asc') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

    return result;
  }, [expenses, searchQuery, sortBy]);

  const filteredTotalAmount = useMemo(() => {
    return filteredAndSortedExpenses.reduce(
      (sum, item) => sum + (Number(item.amount) || 0),
      0
    );
  }, [filteredAndSortedExpenses]);

  // Loading screen during initial auth check
  if (authChecking) {
    return (
      <div className="table-loading-card" style={{ minHeight: '100vh', justifyContent: 'center' }}>
        <div className="spinner-lg"></div>
        <p>Loading Daily Expense Tracker...</p>
      </div>
    );
  }

  // If not logged in, show Auth Page
  if (!currentUser) {
    return (
      <>
        <Toast toast={toast} onClose={() => setToast(null)} />
        <AuthPage onAuthSuccess={handleAuthSuccess} />
      </>
    );
  }

  return (
    <div className="app-layout">
      {/* Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Header */}
      <Header
        totalSpent={summary?.totalAmount || 0}
        totalCount={summary?.totalCount || 0}
        user={currentUser}
        onLogout={handleLogout}
      />

      <main className="main-content">
        {/* Summary & Metrics */}
        <SummaryCards
          summary={summary}
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => setSelectedCategory(cat)}
        />

        {/* Two-Column Responsive Section: Form + Table */}
        <div className="content-grid">
          {/* Left Column: Form */}
          <div className="form-column" ref={formSectionRef}>
            <ExpenseForm
              editingExpense={editingExpense}
              onSave={handleSaveExpense}
              onCancelEdit={handleCancelEdit}
              isSubmitting={isSubmitting}
            />
          </div>

          {/* Right Column: Filters and Table */}
          <div className="list-column">
            <div className="list-header-actions">
              <h2 className="section-title">Expense Records</h2>
              <button
                className="btn-refresh"
                onClick={() => loadData(selectedCategory)}
                title="Refresh expense records"
                disabled={loading}
              >
                <RefreshCw size={16} className={loading ? 'spinning' : ''} />
                <span>Refresh</span>
              </button>
            </div>

            <ExpenseFilters
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              sortBy={sortBy}
              onSortChange={setSortBy}
              totalFilteredCount={filteredAndSortedExpenses.length}
              filteredTotalAmount={filteredTotalAmount}
              formatCurrency={formatCurrency}
            />

            <ExpenseTable
              expenses={filteredAndSortedExpenses}
              loading={loading}
              onEdit={handleEditClick}
              onDeleteRequest={handleDeleteRequest}
              editingExpenseId={editingExpense?.id}
            />
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        expense={deletingExpense}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingExpense(null)}
        isDeleting={isDeleting}
      />

      {/* Footer */}
      <footer className="app-footer">
        <p>
          Expense Tracker &bull; Powered by Spring Boot REST API &amp; React &bull; Persistent H2 Storage
        </p>
      </footer>
    </div>
  );
}
