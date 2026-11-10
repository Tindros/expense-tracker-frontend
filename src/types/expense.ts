export type ExpenseCategory = 
  | 'Food'
  | 'Transportation'
  | 'Shopping'
  | 'Bills'
  | 'Entertainment'
  | 'Other';

export const EXPENSE_CATEGORIES: readonly ExpenseCategory[] = [
  'Food',
  'Transportation',
  'Shopping',
  'Bills',
  'Entertainment',
  'Other'
] as const;

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
}

export interface DashboardSummary {
  totalSpent: number;
  thisMonth: number;
  numberOfExpenses: number;
  topCategory: string;
}

export interface CategorySummary {
  category: ExpenseCategory;
  amount: number;
  percentage: number;
}

export interface SpendingPeriod {
  period: string;
  amount: number;
}

export interface CreateExpenseInput {
  description: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
}

export interface UpdateExpenseInput extends Partial<CreateExpenseInput> {}

export interface ExpenseFilters {
  search: string;
  category: string;
}
