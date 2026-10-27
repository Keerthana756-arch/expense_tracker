import React, { useState, useEffect } from 'react';
import { PlusCircle, Save, XCircle, AlertCircle, Calendar, Tag, DollarSign, Edit3 } from 'lucide-react';

const CATEGORIES = [
  'Food',
  'Travel',
  'Shopping',
  'Utilities',
  'Entertainment',
  'Health',
  'Other',
];

export default function ExpenseForm({ editingExpense, onSave, onCancelEdit, isSubmitting }) {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'Food',
    date: new Date().toISOString().split('T')[0],
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (editingExpense) {
      setFormData({
        title: editingExpense.title || '',
        amount: editingExpense.amount !== undefined ? editingExpense.amount.toString() : '',
        category: editingExpense.category || 'Food',
        date: editingExpense.date || new Date().toISOString().split('T')[0],
      });
      setErrors({});
      setTouched({});
    } else {
      setFormData({
        title: '',
        amount: '',
        category: 'Food',
        date: new Date().toISOString().split('T')[0],
      });
      setErrors({});
      setTouched({});
    }
  }, [editingExpense]);

  const validate = (data) => {
    const errs = {};
    if (!data.title || data.title.trim() === '') {
      errs.title = 'Title is required and cannot be empty.';
    }

    const amountNum = parseFloat(data.amount);
    if (!data.amount || isNaN(amountNum)) {
      errs.amount = 'Please enter a valid amount.';
    } else if (amountNum <= 0) {
      errs.amount = 'Amount must be greater than zero ($0.01 minimum).';
    }

    if (!data.category) {
      errs.category = 'Please select a category.';
    }

    if (!data.date) {
      errs.date = 'Please pick a date.';
    }

    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (touched[name]) {
      const fieldErrors = validate({ ...formData, [name]: value });
      setErrors((prev) => ({
        ...prev,
        [name]: fieldErrors[name],
      }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const fieldErrors = validate(formData);
    setErrors((prev) => ({
      ...prev,
      [name]: fieldErrors[name],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ title: true, amount: true, category: true, date: true });

    const validationErrors = validate(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const payload = {
      title: formData.title.trim(),
      amount: parseFloat(formData.amount),
      category: formData.category,
      date: formData.date,
    };

    const success = await onSave(payload);
    if (success && !editingExpense) {
      // Reset form on successful creation
      setFormData({
        title: '',
        amount: '',
        category: 'Food',
        date: new Date().toISOString().split('T')[0],
      });
      setErrors({});
      setTouched({});
    }
  };

  const isEditing = Boolean(editingExpense);

  return (
    <div className={`expense-form-card ${isEditing ? 'editing-mode' : ''}`}>
      <div className="form-header">
        <div className="form-title-wrap">
          {isEditing ? (
            <>
              <div className="icon-badge edit">
                <Edit3 size={20} />
              </div>
              <div>
                <h3>Edit Expense</h3>
                <p className="form-subtitle">Update details for this record</p>
              </div>
            </>
          ) : (
            <>
              <div className="icon-badge add">
                <PlusCircle size={20} />
              </div>
              <div>
                <h3>Add New Expense</h3>
                <p className="form-subtitle">Record a recent everyday transaction</p>
              </div>
            </>
          )}
        </div>

        {isEditing && (
          <button
            type="button"
            className="btn btn-secondary-compact"
            onClick={onCancelEdit}
            title="Cancel editing"
          >
            <XCircle size={16} />
            <span>Cancel</span>
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-grid">
          {/* Title Field */}
          <div className="form-group full-width">
            <label htmlFor="title">
              Expense Title <span className="required-star">*</span>
            </label>
            <div className="input-wrap">
              <input
                id="title"
                name="title"
                type="text"
                placeholder="e.g., Grocery shopping, Uber ride, Coffee"
                value={formData.title}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errors.title ? 'input-error' : ''}
                autoComplete="off"
              />
            </div>
            {errors.title && (
              <div className="field-error-msg">
                <AlertCircle size={14} />
                <span>{errors.title}</span>
              </div>
            )}
          </div>

          {/* Amount Field */}
          <div className="form-group">
            <label htmlFor="amount">
              Amount ($) <span className="required-star">*</span>
            </label>
            <div className="input-wrap icon-left">
              <DollarSign className="input-icon" size={16} />
              <input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={formData.amount}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errors.amount ? 'input-error' : ''}
              />
            </div>
            {errors.amount && (
              <div className="field-error-msg">
                <AlertCircle size={14} />
                <span>{errors.amount}</span>
              </div>
            )}
          </div>

          {/* Category Field */}
          <div className="form-group">
            <label htmlFor="category">
              Category <span className="required-star">*</span>
            </label>
            <div className="input-wrap icon-left">
              <Tag className="input-icon" size={16} />
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errors.category ? 'input-error' : ''}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            {errors.category && (
              <div className="field-error-msg">
                <AlertCircle size={14} />
                <span>{errors.category}</span>
              </div>
            )}
          </div>

          {/* Date Field */}
          <div className="form-group full-width">
            <label htmlFor="date">
              Date <span className="required-star">*</span>
            </label>
            <div className="input-wrap icon-left">
              <Calendar className="input-icon" size={16} />
              <input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errors.date ? 'input-error' : ''}
              />
            </div>
            {errors.date && (
              <div className="field-error-msg">
                <AlertCircle size={14} />
                <span>{errors.date}</span>
              </div>
            )}
          </div>
        </div>

        <div className="form-actions">
          {isEditing && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancelEdit}
              disabled={isSubmitting}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className={`btn btn-primary ${isEditing ? 'btn-update' : ''}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="spinner-sm"></span>
            ) : isEditing ? (
              <>
                <Save size={18} />
                <span>Update Expense</span>
              </>
            ) : (
              <>
                <PlusCircle size={18} />
                <span>Add Expense</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

