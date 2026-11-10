import type { Expense } from '../../types/expense';
import { formatCurrency, formatDate } from '../../utils/format';
import './DashboardComponents.css';

interface Props {
  expenses: Expense[];
}

export function RecentExpensesList({ expenses }: Props) {
  if (expenses.length === 0) return <div className="no-data">No recent expenses.</div>;

  return (
    <div className="recent-expenses-list">
      {expenses.map((expense) => (
        <div key={expense.id} className="expense-row">
          <div className="expense-row-left">
            <div className="expense-category-badge">{expense.category}</div>
            <div className="expense-details">
              <div className="expense-desc">{expense.description}</div>
              <div className="expense-date">{formatDate(expense.date)}</div>
            </div>
          </div>
          <div className="expense-row-right">
            <span className="expense-amount">{formatCurrency(expense.amount)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
