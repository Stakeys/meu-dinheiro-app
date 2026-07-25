export function formatCurrency(value: number, currency: string = "BRL"): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency }).format(value);
}

export function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
}

const MONTH_LABELS = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

export function formatMonthLabel(monthKey: string): string {
  const [, month] = monthKey.split("-");
  const index = Number(month) - 1;
  return MONTH_LABELS[index] ?? monthKey;
}

export function formatMonthYear(monthKey: string): string {
  const [year, month] = monthKey.split("-");
  const index = Number(month) - 1;
  return `${MONTH_LABELS[index] ?? month} ${year}`;
}

export function formatDateShort(dateKey: string): string {
  const [, month, day] = dateKey.split("-");
  return `${day}/${month}`;
}
