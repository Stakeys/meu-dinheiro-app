export function formatCurrency(value: number, currency: string = "BRL"): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency }).format(value);
}

export function getCurrencySymbol(currency: string = "BRL"): string {
  // formatToParts não existe no Hermes (motor JS do React Native), então extraímos
  // o símbolo removendo os dígitos/pontuação do resultado já formatado.
  const formatted = formatCurrency(0, currency);
  const symbol = formatted.replace(/[\d.,\s ]/g, "").trim();
  return symbol || currency;
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
