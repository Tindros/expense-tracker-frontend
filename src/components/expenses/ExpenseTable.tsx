import { Link } from 'react-router-dom';
import type { Expense } from '../../types/expense';
import { formatCurrency, formatDate } from '../../utils/format';

interface Props {
  expenses: Expense[];
  onDeleteClick: (expense: Expense) => void;
}

export function ExpenseTable({ expenses, onDeleteClick }: Props) {
  if (expenses.length === 0) {
    return <div className="expense-empty-state">No expenses found matching your criteria.</div>;
  }

  return (
    <div className="expense-table-container">
      <table className="expense-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Category</th>
            <th className="align-right">Amount</th>
            <th className="align-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map(exp => (
            <tr key={exp.id}>
              <td>{formatDate(exp.date)}</td>
              <td className="description-cell">{exp.description}</td>
              <td><span className="expense-category-badge">{exp.category}</span></td>
              <td className="align-right amount-cell">{formatCurrency(exp.amount)}</td>
              <td className="align-right actions-cell">
                <Link to={`/expenses/${exp.id}/edit`} className="action-btn edit-btn">Edit</Link>
                <button onClick={() => onDeleteClick(exp)} className="action-btn delete-btn">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Mobile view - cards */}
      <div className="expense-mobile-list">
        {expenses.map(exp => (
          <div key={exp.id} className="expense-mobile-card">
            <div className="expense-mobile-header">
              <span className="expense-category-badge">{exp.category}</span>
              <span className="amount-cell">{formatCurrency(exp.amount)}</span>
            </div>
            <div className="expense-mobile-body">
              <div className="description-cell">{exp.description}</div>
              <div className="date-cell">{formatDate(exp.date)}</div>
            </div>
            <div className="expense-mobile-footer">
              <Link to={`/expenses/${exp.id}/edit`} className="action-btn edit-btn">Edit</Link>
              <button onClick={() => onDeleteClick(exp)} className="action-btn delete-btn">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
