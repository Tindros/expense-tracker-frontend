export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function formatDate(dateString: string): string {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-');
  const y = Number(year);
  const m = Number(month);
  const d = Number(day);
  // Guard against non-numeric or out-of-range parts
  if (!year || !month || !day || isNaN(y) || isNaN(m) || isNaN(d)) return dateString;

  const date = new Date(y, m - 1, d);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
}

/**
 * Returns today's date as a YYYY-MM-DD string using the LOCAL calendar date.
 * Avoids the UTC-shift bug of `new Date().toISOString().split('T')[0]`,
 * which can produce yesterday's date for users in UTC+ timezones.
 */
export function todayLocalDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Returns the current local year-month as a YYYY-MM string (e.g. "2026-10").
 * Used for consistent "this month" filtering across the dashboard.
 */
export function currentLocalYearMonth(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}
