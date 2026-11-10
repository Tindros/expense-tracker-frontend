import type { SpendingPeriod } from '../../types/expense';
import { formatCurrency } from '../../utils/format';
import './DashboardComponents.css';

interface Props {
  data: SpendingPeriod[];
}

export function SpendingChart({ data }: Props) {
  if (data.length === 0) return <div className="no-data">No data available</div>;

  const maxAmount = Math.max(...data.map(d => d.amount));

  return (
    <div className="spending-chart">
      {data.map((item, index) => {
        const heightPercent = maxAmount > 0 ? (item.amount / maxAmount) * 100 : 0;
        return (
          <div key={index} className="spending-bar-container">
            <div className="spending-bar-label-top">{formatCurrency(item.amount)}</div>
            <div className="spending-bar-wrapper">
              <div 
                className="spending-bar-fill" 
                style={{ height: `${heightPercent}%` }}
              ></div>
            </div>
            <div className="spending-bar-label-bottom">{item.period}</div>
          </div>
        );
      })}
    </div>
  );
}
