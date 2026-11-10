import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { expenseService } from '../services/expenseService';
import type { Expense, ExpenseFilters as FilterType } from '../types/expense';
import { ExpenseTable } from '../components/expenses/ExpenseTable';
import { ExpenseFilters } from '../components/expenses/ExpenseFilters';
import { DeleteConfirmation } from '../components/expenses/DeleteConfirmation';
import './Expenses.css';

export default function Expenses() {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [filters, setFilters] = useState<FilterType>({ search: '', category: 'All' });
  
  // Delete state
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const data = await expenseService.getExpenses();
      setExpenses(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleDeleteConfirm = async () => {
    if (!expenseToDelete) return;
    setIsDeleting(true);
    try {
      await expenseService.deleteExpense(expenseToDelete.id);
      setExpenses(expenses.filter(e => e.id !== expenseToDelete.id));
      setExpenseToDelete(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredExpenses = expenses.filter(exp => {
    const matchesSearch = exp.description.toLowerCase().includes(filters.search.toLowerCase()) ||
                          exp.category.toLowerCase().includes(filters.search.toLowerCase());
    const matchesCategory = filters.category === 'All' || exp.category === filters.category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="expenses-page">
      <header className="dashboard-header" style={{ marginBottom: '2rem' }}>
        <div>
          <h2>Expenses</h2>
          <p>Manage and track all your personal expenses.</p>
        </div>
        <button className="btn-primary add-expense-btn" onClick={() => navigate('/expenses/new')}>
          + Add Expense
        </button>
      </header>

      <ExpenseFilters 
        search={filters.search}
        category={filters.category}
        onSearchChange={val => setFilters(prev => ({ ...prev, search: val }))}
        onCategoryChange={val => setFilters(prev => ({ ...prev, category: val }))}
      />

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }} aria-live="polite" aria-label="Loading expenses">Loading expenses...</div>
      ) : (
        <ExpenseTable 
          expenses={filteredExpenses} 
          onDeleteClick={(exp) => setExpenseToDelete(exp)} 
        />
      )}

      <DeleteConfirmation 
        isOpen={!!expenseToDelete}
        isDeleting={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setExpenseToDelete(null)}
      />
    </div>
  );
}
