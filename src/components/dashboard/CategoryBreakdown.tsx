import type { CategorySummary } from '../../types/expense';
import { formatCurrency } from '../../utils/format';
import './DashboardComponents.css';

interface Props {
  categories: CategorySummary[];
}

export function CategoryBreakdown({ categories }: Props) {
  if (categories.length === 0) return <div className="no-data">No categories available</div>;

  return (
    <div className="category-breakdown">
      {categories.map((cat, index) => (
        <div key={index} className="category-item">
          <div className="category-item-header">
            <span className="category-name">{cat.category}</span>
            <span className="category-amount">{formatCurrency(cat.amount)}</span>
          </div>
          <div className="category-progress-bg">
            <div 
              className="category-progress-fill"
              style={{ width: `${cat.percentage}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
}
