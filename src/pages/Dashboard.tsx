import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { expenseService } from '../services/expenseService';
import type { DashboardSummary, Expense, CategorySummary, SpendingPeriod } from '../types/expense';
import { SummaryCard } from '../components/dashboard/SummaryCard';
import { SpendingChart } from '../components/dashboard/SpendingChart';
import { CategoryBreakdown } from '../components/dashboard/CategoryBreakdown';
import { RecentExpensesList } from '../components/dashboard/RecentExpensesList';
import { formatCurrency } from '../utils/format';
import './Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [recentExpenses, setRecentExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<CategorySummary[]>([]);
  const [spending, setSpending] = useState<SpendingPeriod[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [sum, exp, cat, spend] = await Promise.all([
          expenseService.getDashboardSummary(),
          expenseService.getRecentExpenses(5),
          expenseService.getCategoryBreakdown(),
          expenseService.getSpendingOverview()
        ]);
        setSummary(sum);
        setRecentExpenses(exp);
        setCategories(cat);
        setSpending(spend);
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  if (isLoading) {
    return <div className="dashboard-loading" aria-live="polite" aria-label="Loading dashboard">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div>
          <h2>Dashboard</h2>
          <p>Here's an overview of your spending.</p>
        </div>
        <button className="btn-primary add-expense-btn" onClick={() => navigate('/expenses/new')}>
          + Add Expense
        </button>
      </header>

      {summary && (
        <div className="dashboard-summary-grid">
          <SummaryCard title="Total Spent" value={formatCurrency(summary.totalSpent)} />
          <SummaryCard title="This Month" value={formatCurrency(summary.thisMonth)} />
          <SummaryCard title="Number of Expenses" value={summary.numberOfExpenses.toString()} />
          <SummaryCard title="Top Category" value={summary.topCategory} />
        </div>
      )}

      <div className="dashboard-main-grid">
        <div className="dashboard-column">
          <section className="dashboard-card">
            <h3>Spending Overview</h3>
            <SpendingChart data={spending} />
          </section>

          <section className="dashboard-card">
            <div className="dashboard-card-header">
              <h3>Recent Expenses</h3>
              <Link to="/expenses" className="link-action">View all expenses</Link>
            </div>
            <RecentExpensesList expenses={recentExpenses} />
          </section>
        </div>

        <div className="dashboard-column">
          <section className="dashboard-card">
            <h3>Spending by Category</h3>
            <CategoryBreakdown categories={categories} />
          </section>
        </div>
      </div>
    </div>
  );
}
