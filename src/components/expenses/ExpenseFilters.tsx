

interface Props {
  search: string;
  category: string;
  onSearchChange: (val: string) => void;
  onCategoryChange: (val: string) => void;
}

const CATEGORIES = ['All', 'Food', 'Transportation', 'Shopping', 'Bills', 'Entertainment', 'Other'];

export function ExpenseFilters({ search, category, onSearchChange, onCategoryChange }: Props) {
  return (
    <div className="expense-filters">
      <div className="filter-group">
        <label htmlFor="search-input">Search</label>
        <input 
          id="search-input"
          type="text" 
          className="input-field filter-input"
          placeholder="Search by description..."
          value={search}
          onChange={e => onSearchChange(e.target.value)}
        />
      </div>
      <div className="filter-group">
        <label htmlFor="category-select">Category</label>
        <select 
          id="category-select"
          className="input-field filter-select"
          value={category}
          onChange={e => onCategoryChange(e.target.value)}
        >
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
    </div>
  );
}
