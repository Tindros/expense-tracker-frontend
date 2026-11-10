import type {
  Expense,
  ExpenseCategory,
  DashboardSummary,
  CategorySummary,
  SpendingPeriod,
  CreateExpenseInput,
  UpdateExpenseInput,
} from '../types/expense';

import { currentLocalYearMonth } from '../utils/format';
import { authService } from './authService';

/*
 * API Gateway base URL.
 * Remove trailing slashes so:
 * https://example.amazonaws.com/
 * becomes:
 * https://example.amazonaws.com
 *
 * This prevents requests such as:
 * https://example.amazonaws.com//expenses
 */
const API_URL =
  import.meta.env.VITE_API_URL?.replace(/\/+$/, '');

if (!API_URL) {
  console.warn('VITE_API_URL is not configured');
}

interface ApiExpense {
  expenseId: string;
  userId: string;
  amount: number;
  category: ExpenseCategory;
  description: string;
  date: string;
  createdAt?: string;
}

interface ApiExpensesResponse {
  expenses: ApiExpense[];
}

interface ApiSummaryResponse {
  total: number;
  count: number;
  byCategory: Record<string, number>;
}

function getAuthHeaders(): HeadersInit {
  const token = authService.getAccessToken();

  if (!token) {
    throw new Error('User is not authenticated');
  }

  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

function mapExpense(expense: ApiExpense): Expense {
  return {
    id: expense.expenseId,
    description: expense.description,
    amount: expense.amount,
    category: expense.category,
    date: expense.date,
  };
}

async function apiRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  if (!API_URL) {
    throw new Error('API URL is not configured');
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    let message = `API request failed: ${response.status}`;

    try {
      const errorBody = await response.json();

      if (errorBody.message) {
        message = errorBody.message;
      }
    } catch {
      // Ignore JSON parsing errors
    }

    throw new Error(message);
  }

  return response.json();
}

export const expenseService = {
  async getDashboardSummary(): Promise<DashboardSummary> {
    const [expenses, summary] = await Promise.all([
      this.getExpenses(),
      this.getApiSummary(),
    ]);

    const currentMonth = currentLocalYearMonth();

    const thisMonth = expenses
      .filter((expense) =>
        expense.date.startsWith(currentMonth)
      )
      .reduce(
        (sum, expense) => sum + expense.amount,
        0
      );

    let topCategory = 'None';
    let max = 0;

    for (const [category, amount] of Object.entries(
      summary.byCategory
    ) as [string, number][]) {
      if (amount > max) {
        max = amount;
        topCategory = category;
      }
    }

    return {
      totalSpent: summary.total,
      thisMonth,
      numberOfExpenses: summary.count,
      topCategory,
    };
  },

  async getRecentExpenses(
    limit: number = 5
  ): Promise<Expense[]> {
    const expenses = await this.getExpenses();

    return expenses
      .sort(
        (a, b) =>
          new Date(b.date).getTime() -
          new Date(a.date).getTime()
      )
      .slice(0, limit);
  },

  async getCategoryBreakdown(): Promise<CategorySummary[]> {
    const summary = await this.getApiSummary();

    const totalSpent = summary.total;

    const breakdown: CategorySummary[] = (
      Object.entries(
        summary.byCategory
      ) as [string, number][]
    ).map(([category, amount]) => ({
      category: category as ExpenseCategory,
      amount,
      percentage:
        totalSpent > 0
          ? (amount / totalSpent) * 100
          : 0,
    }));

    return breakdown.sort(
      (a, b) => b.amount - a.amount
    );
  },

  async getSpendingOverview(): Promise<SpendingPeriod[]> {
    const expenses = await this.getExpenses();

    const periods: SpendingPeriod[] = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const date = new Date(
        now.getFullYear(),
        now.getMonth() - i,
        1
      );

      const periodLabel = date.toLocaleString(
        'en-US',
        {
          month: 'short',
        }
      );

      const yearMonth =
        `${date.getFullYear()}-` +
        `${String(
          date.getMonth() + 1
        ).padStart(2, '0')}`;

      const amount = expenses
        .filter((expense) =>
          expense.date.startsWith(yearMonth)
        )
        .reduce(
          (sum, expense) =>
            sum + expense.amount,
          0
        );

      periods.push({
        period: periodLabel,
        amount,
      });
    }

    return periods;
  },

  async getExpenses(): Promise<Expense[]> {
    const data =
      await apiRequest<ApiExpensesResponse>(
        '/expenses'
      );

    return data.expenses.map(mapExpense);
  },

  async getExpenseById(
    id: string
  ): Promise<Expense | null> {
    try {
      const data =
        await apiRequest<ApiExpense>(
          `/expenses/${encodeURIComponent(id)}`
        );

      return mapExpense(data);
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === 'Expense not found'
      ) {
        return null;
      }

      throw error;
    }
  },

  async createExpense(
    input: CreateExpenseInput
  ): Promise<Expense> {
    const data =
      await apiRequest<ApiExpense>(
        '/expenses',
        {
          method: 'POST',
          body: JSON.stringify({
            amount: input.amount,
            category: input.category,
            description: input.description,
            date: input.date,
          }),
        }
      );

    return mapExpense(data);
  },

  async updateExpense(
    id: string,
    input: UpdateExpenseInput
  ): Promise<Expense> {
    const data =
      await apiRequest<ApiExpense>(
        `/expenses/${encodeURIComponent(id)}`,
        {
          method: 'PUT',
          body: JSON.stringify({
            amount: input.amount,
            category: input.category,
            description: input.description,
            date: input.date,
          }),
        }
      );

    return mapExpense(data);
  },

  async deleteExpense(
    id: string
  ): Promise<void> {
    await apiRequest<{ message: string }>(
      `/expenses/${encodeURIComponent(id)}`,
      {
        method: 'DELETE',
      }
    );
  },

  async getApiSummary(): Promise<ApiSummaryResponse> {
    return apiRequest<ApiSummaryResponse>(
      '/summary'
    );
  },
};