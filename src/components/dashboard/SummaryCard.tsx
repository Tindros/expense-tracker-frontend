import './DashboardComponents.css';

interface Props {
  title: string;
  value: string;
}

export function SummaryCard({ title, value }: Props) {
  return (
    <div className="summary-card">
      <h4 className="summary-card-title">{title}</h4>
      <p className="summary-card-value">{value}</p>
    </div>
  );
}
