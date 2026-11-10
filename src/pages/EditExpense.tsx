import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ExpenseForm } from '../components/expenses/ExpenseForm';
import { expenseService } from '../services/expenseService';
import type { Expense, UpdateExpenseInput } from '../types/expense';
import './Expenses.css';

export default function EditExpense() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expense, setExpense] = useState<Expense | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchExpense = async () => {
      try {
        const data = await expenseService.getExpenseById(id);
        if (data) setExpense(data);
        else navigate('/expenses');
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchExpense();
  }, [id, navigate]);

  const handleSubmit = async (data: UpdateExpenseInput) => {
    if (!id) return;
    setIsSubmitting(true);
    try {
      await expenseService.updateExpense(id, data);
      navigate('/expenses');
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>Loading...</div>;
  }

  if (!expense) return null;

  return (
    <div className="expenses-page">
      <header className="dashboard-header" style={{ marginBottom: '2rem' }}>
        <div>
          <h2>Edit Expense</h2>
          <p>Update transaction details.</p>
        </div>
      </header>

      <div className="expense-form-container">
        <ExpenseForm 
          initialData={{
            description: expense.description,
            amount: expense.amount,
            category: expense.category,
            date: expense.date
          }}
          onSubmit={handleSubmit} 
          isSubmitting={isSubmitting} 
        />
      </div>
    </div>
  );
}
