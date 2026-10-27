import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatters';

export default function DeleteConfirmModal({ expense, onConfirm, onCancel, isDeleting }) {
  if (!expense) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onCancel} title="Close">
          <X size={18} />
        </button>

        <div className="modal-icon-wrap">
          <AlertTriangle size={32} className="warning-icon" />
        </div>

        <h3 className="modal-title">Delete Expense?</h3>
        <p className="modal-description">
          Are you sure you want to delete this expense? This action cannot be undone.
        </p>

        <div className="modal-expense-preview">
          <div className="preview-row">
            <span className="preview-label">Expense:</span>
            <span className="preview-value title">{expense.title}</span>
          </div>
          <div className="preview-row">
            <span className="preview-label">Amount:</span>
            <span className="preview-value amount">{formatCurrency(expense.amount)}</span>
          </div>
          <div className="preview-row">
            <span className="preview-label">Category:</span>
            <span className="preview-value">{expense.category}</span>
          </div>
          <div className="preview-row">
            <span className="preview-label">Date:</span>
            <span className="preview-value">{formatDate(expense.date)}</span>
          </div>
        </div>

        <div className="modal-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => onConfirm(expense.id)}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <span className="spinner-sm"></span>
            ) : (
              <>
                <Trash2 size={16} />
                <span>Yes, Delete</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

