import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExpenseForm } from '../components/expenses/ExpenseForm';
import { expenseService } from '../services/expenseService';
import type { CreateExpenseInput } from '../types/expense';
import './Expenses.css';

export default function NewExpense() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: CreateExpenseInput) => {
    setIsSubmitting(true);
    try {
      await expenseService.createExpense(data);
      navigate('/expenses');
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="expenses-page">
      <header className="dashboard-header" style={{ marginBottom: '2rem' }}>
        <div>
          <h2>Add New Expense</h2>
          <p>Record a new transaction.</p>
        </div>
      </header>

      <div className="expense-form-container">
        <ExpenseForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </div>
  );
}
