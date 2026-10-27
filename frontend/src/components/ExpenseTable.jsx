import React from 'react';
import {
  Edit2,
  Trash2,
  Calendar,
  Tag,
  DollarSign,
  Utensils,
  Plane,
  ShoppingBag,
  Zap,
  Film,
  HeartPulse,
  Receipt,
  FileQuestion,
} from 'lucide-react';
import { formatCurrency, formatDate, getCategoryConfig } from '../utils/formatters';

const getCategoryIcon = (category) => {
  switch (category) {
    case 'Food':
      return <Utensils size={15} />;
    case 'Travel':
      return <Plane size={15} />;
    case 'Shopping':
      return <ShoppingBag size={15} />;
    case 'Utilities':
      return <Zap size={15} />;
    case 'Entertainment':
      return <Film size={15} />;
    case 'Health':
      return <HeartPulse size={15} />;
    default:
      return <Tag size={15} />;
  }
};

export default function ExpenseTable({
  expenses,
  loading,
  onEdit,
  onDeleteRequest,
  editingExpenseId,
}) {
  if (loading) {
    return (
      <div className="table-loading-card">
        <div className="spinner-lg"></div>
        <p>Loading expenses...</p>
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="table-empty-card">
        <div className="empty-icon-wrap">
          <FileQuestion size={44} />
        </div>
        <h4>No Expenses Found</h4>
        <p>There are no expense records matching your current filter criteria.</p>
      </div>
    );
  }

  return (
    <div className="expense-table-container">
      {/* Desktop Table View */}
      <div className="table-responsive">
        <table className="expense-table">
          <thead>
            <tr>
              <th className="th-date">Date</th>
              <th className="th-title">Title / Description</th>
              <th className="th-category">Category</th>
              <th className="th-amount">Amount</th>
              <th className="th-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => {
              const isBeingEdited = editingExpenseId === expense.id;
              const config = getCategoryConfig(expense.category);

              return (
                <tr
                  key={expense.id}
                  className={`expense-row ${isBeingEdited ? 'row-editing' : ''}`}
                >
                  {/* Date Column */}
                  <td className="td-date">
                    <div className="date-cell">
                      <Calendar size={14} className="cell-sub-icon" />
                      <span>{formatDate(expense.date)}</span>
                    </div>
                  </td>

                  {/* Title Column */}
                  <td className="td-title">
                    <span className="expense-title-text" title={expense.title}>
                      {expense.title}
                    </span>
                  </td>

                  {/* Category Column */}
                  <td className="td-category">
                    <span
                      className="category-badge"
                      style={{
                        backgroundColor: config.bgColor,
                        color: config.color,
                        borderColor: config.borderColor,
                      }}
                    >
                      <span className="cat-icon">{getCategoryIcon(expense.category)}</span>
                      <span>{expense.category}</span>
                    </span>
                  </td>

                  {/* Amount Column */}
                  <td className="td-amount">
                    <span className="expense-amount-text">
                      {formatCurrency(expense.amount)}
                    </span>
                  </td>

                  {/* Actions Column */}
                  <td className="td-actions">
                    <div className="action-buttons-wrap">
                      <button
                        type="button"
                        className="btn-action edit"
                        onClick={() => onEdit(expense)}
                        title="Edit expense"
                        aria-label={`Edit ${expense.title}`}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        type="button"
                        className="btn-action delete"
                        onClick={() => onDeleteRequest(expense)}
                        title="Delete expense"
                        aria-label={`Delete ${expense.title}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="mobile-cards-view">
        {expenses.map((expense) => {
          const isBeingEdited = editingExpenseId === expense.id;
          const config = getCategoryConfig(expense.category);

          return (
            <div
              key={expense.id}
              className={`mobile-expense-card ${isBeingEdited ? 'card-editing' : ''}`}
            >
              <div className="mobile-card-top">
                <div className="mobile-card-header-left">
                  <span
                    className="category-badge"
                    style={{
                      backgroundColor: config.bgColor,
                      color: config.color,
                      borderColor: config.borderColor,
                    }}
                  >
                    <span className="cat-icon">{getCategoryIcon(expense.category)}</span>
                    <span>{expense.category}</span>
                  </span>
                  <span className="mobile-date">{formatDate(expense.date)}</span>
                </div>
                <div className="mobile-card-amount">
                  {formatCurrency(expense.amount)}
                </div>
              </div>

              <div className="mobile-card-title">{expense.title}</div>

              <div className="mobile-card-footer">
                <button
                  type="button"
                  className="btn btn-secondary-compact"
                  onClick={() => onEdit(expense)}
                >
                  <Edit2 size={14} />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  className="btn btn-danger-compact"
                  onClick={() => onDeleteRequest(expense)}
                >
                  <Trash2 size={14} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

