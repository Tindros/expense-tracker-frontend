import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import type { CreateExpenseInput, ExpenseCategory } from '../../types/expense';
import { EXPENSE_CATEGORIES } from '../../types/expense';
import { todayLocalDate } from '../../utils/format';

interface ExpenseFormData {
  description: string;
  amount: number | '';
  category: ExpenseCategory | '';
  date: string;
}

interface Props {
  initialData?: ExpenseFormData;
  // onSubmit receives a fully-validated CreateExpenseInput — no `any` needed
  onSubmit: (data: CreateExpenseInput) => Promise<void>;
  isSubmitting: boolean;
}

export function ExpenseForm({ initialData, onSubmit, isSubmitting }: Props) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ExpenseFormData>({
    description: '',
    amount: '',
    category: '',
    date: todayLocalDate(), // Use local calendar date — avoids UTC-shift bug
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Trim and check description for whitespace-only input
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    // Amount must be a finite number greater than zero
    const parsedAmount = Number(formData.amount);
    if (formData.amount === '' || !isFinite(parsedAmount) || parsedAmount <= 0) {
      newErrors.amount = 'Amount must be greater than zero';
    }

    // Category must be one of the known enum values
    if (!formData.category || !EXPENSE_CATEGORIES.includes(formData.category as ExpenseCategory)) {
      newErrors.category = 'Category is required';
    }

    // Date must be present and match YYYY-MM-DD format
    if (!formData.date || !/^\d{4}-\d{2}-\d{2}$/.test(formData.date)) {
      newErrors.date = 'A valid date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // At this point all fields are validated — safe to assert types
    await onSubmit({
      description: formData.description.trim(),
      amount: Number(formData.amount),
      category: formData.category as ExpenseCategory,
      date: formData.date,
    });
  };

  return (
    <form className="expense-form" onSubmit={handleSubmit} noValidate aria-label="Expense form">
      {/* Amount */}
      <div className="form-group">
        <label htmlFor="expense-amount">Amount</label>
        <div className="amount-input-wrapper">
          <span className="currency-symbol" aria-hidden="true">$</span>
          <input
            id="expense-amount"
            type="number"
            step="0.01"
            min="0.01"
            className={`input-field ${errors.amount ? 'input-error' : ''}`}
            value={formData.amount}
            onChange={e => setFormData({ ...formData, amount: e.target.value ? Number(e.target.value) : '' })}
            disabled={isSubmitting}
            placeholder="0.00"
            aria-describedby={errors.amount ? 'amount-error' : undefined}
            aria-invalid={errors.amount ? true : undefined}
          />
        </div>
        {errors.amount && (
          <span id="amount-error" className="error-message" role="alert">
            {errors.amount}
          </span>
        )}
      </div>

      {/* Category */}
      <div className="form-group">
        <label htmlFor="expense-category">Category</label>
        <select
          id="expense-category"
          className={`input-field ${errors.category ? 'input-error' : ''}`}
          value={formData.category}
          onChange={e => setFormData({ ...formData, category: e.target.value as ExpenseCategory })}
          disabled={isSubmitting}
          aria-describedby={errors.category ? 'category-error' : undefined}
          aria-invalid={errors.category ? true : undefined}
        >
          <option value="" disabled>Select category</option>
          {EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        {errors.category && (
          <span id="category-error" className="error-message" role="alert">
            {errors.category}
          </span>
        )}
      </div>

      {/* Description */}
      <div className="form-group">
        <label htmlFor="expense-description">Description</label>
        <input
          id="expense-description"
          type="text"
          className={`input-field ${errors.description ? 'input-error' : ''}`}
          value={formData.description}
          onChange={e => setFormData({ ...formData, description: e.target.value })}
          disabled={isSubmitting}
          placeholder="What was this for?"
          maxLength={100}
          aria-describedby={errors.description ? 'description-error' : undefined}
          aria-invalid={errors.description ? true : undefined}
        />
        {errors.description && (
          <span id="description-error" className="error-message" role="alert">
            {errors.description}
          </span>
        )}
      </div>

      {/* Date */}
      <div className="form-group">
        <label htmlFor="expense-date">Date</label>
        <input
          id="expense-date"
          type="date"
          className={`input-field ${errors.date ? 'input-error' : ''}`}
          value={formData.date}
          onChange={e => setFormData({ ...formData, date: e.target.value })}
          disabled={isSubmitting}
          aria-describedby={errors.date ? 'date-error' : undefined}
          aria-invalid={errors.date ? true : undefined}
        />
        {errors.date && (
          <span id="date-error" className="error-message" role="alert">
            {errors.date}
          </span>
        )}
      </div>

      <div className="form-actions">
        <button type="button" className="btn-secondary" onClick={() => navigate('/expenses')} disabled={isSubmitting}>
          Cancel
        </button>
        <button type="submit" className="btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Expense'}
        </button>
      </div>
    </form>
  );
}
