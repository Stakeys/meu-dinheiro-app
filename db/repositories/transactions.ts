import { db } from "../client";
import type { Bucket, Transaction, TransactionType } from "../types";
import { recalculateAccountBalance } from "./accounts";

export function listTransactions(limit?: number): Transaction[] {
  if (limit) {
    return db.getAllSync<Transaction>(
      "SELECT * FROM transactions ORDER BY date DESC, id DESC LIMIT ?",
      limit
    );
  }
  return db.getAllSync<Transaction>("SELECT * FROM transactions ORDER BY date DESC, id DESC");
}

export function listTransactionsByMonth(month: string): Transaction[] {
  return db.getAllSync<Transaction>(
    "SELECT * FROM transactions WHERE substr(date, 1, 7) = ? ORDER BY date DESC, id DESC",
    month
  );
}

export function createTransaction(input: Omit<Transaction, "id">): Transaction {
  const result = db.runSync(
    "INSERT INTO transactions (account_id, category_id, type, amount, description, date) VALUES (?, ?, ?, ?, ?, ?)",
    input.account_id,
    input.category_id,
    input.type,
    input.amount,
    input.description,
    input.date
  );
  recalculateAccountBalance(input.account_id);
  return { id: result.lastInsertRowId, ...input };
}

export function updateTransaction(id: number, input: Omit<Transaction, "id">): void {
  const previous = db.getFirstSync<Transaction>("SELECT * FROM transactions WHERE id = ?", id);
  db.runSync(
    "UPDATE transactions SET account_id = ?, category_id = ?, type = ?, amount = ?, description = ?, date = ? WHERE id = ?",
    input.account_id,
    input.category_id,
    input.type,
    input.amount,
    input.description,
    input.date,
    id
  );
  recalculateAccountBalance(input.account_id);
  if (previous && previous.account_id !== input.account_id) {
    recalculateAccountBalance(previous.account_id);
  }
}

export function deleteTransaction(id: number): void {
  const previous = db.getFirstSync<Transaction>("SELECT * FROM transactions WHERE id = ?", id);
  db.runSync("DELETE FROM transactions WHERE id = ?", id);
  if (previous) {
    recalculateAccountBalance(previous.account_id);
  }
}

export function getTotalsByType(month: string): { income: number; expense: number } {
  const rows = db.getAllSync<{ type: TransactionType; total: number }>(
    "SELECT type, COALESCE(SUM(amount), 0) as total FROM transactions WHERE substr(date, 1, 7) = ? GROUP BY type",
    month
  );
  const income = rows.find((r) => r.type === "income")?.total ?? 0;
  const expense = rows.find((r) => r.type === "expense")?.total ?? 0;
  return { income, expense };
}

export function getExpensesByCategory(
  month: string
): { category_id: number | null; name: string; color: string; total: number }[] {
  return db.getAllSync(
    `SELECT t.category_id as category_id, COALESCE(c.name, 'Outros') as name, COALESCE(c.color, '#94A3B8') as color,
            SUM(t.amount) as total
     FROM transactions t
     LEFT JOIN categories c ON c.id = t.category_id
     WHERE t.type = 'expense' AND substr(t.date, 1, 7) = ?
     GROUP BY t.category_id
     ORDER BY total DESC`,
    month
  );
}

export function getExpensesByBucket(month: string): { bucket: Bucket; total: number }[] {
  return db.getAllSync(
    `SELECT COALESCE(c.bucket, 'outros') as bucket, SUM(t.amount) as total
     FROM transactions t
     LEFT JOIN categories c ON c.id = t.category_id
     WHERE t.type = 'expense' AND substr(t.date, 1, 7) = ?
     GROUP BY bucket`,
    month
  );
}

export function getTotalsByTypeRange(startMonth: string, endMonth: string): { income: number; expense: number } {
  const rows = db.getAllSync<{ type: TransactionType; total: number }>(
    "SELECT type, COALESCE(SUM(amount), 0) as total FROM transactions WHERE substr(date, 1, 7) BETWEEN ? AND ? GROUP BY type",
    startMonth,
    endMonth
  );
  const income = rows.find((r) => r.type === "income")?.total ?? 0;
  const expense = rows.find((r) => r.type === "expense")?.total ?? 0;
  return { income, expense };
}

export function getExpensesByCategoryRange(
  startMonth: string,
  endMonth: string
): { category_id: number | null; name: string; color: string; total: number }[] {
  return db.getAllSync(
    `SELECT t.category_id as category_id, COALESCE(c.name, 'Outros') as name, COALESCE(c.color, '#94A3B8') as color,
            SUM(t.amount) as total
     FROM transactions t
     LEFT JOIN categories c ON c.id = t.category_id
     WHERE t.type = 'expense' AND substr(t.date, 1, 7) BETWEEN ? AND ?
     GROUP BY t.category_id
     ORDER BY total DESC`,
    startMonth,
    endMonth
  );
}

export function getMonthlyExpenseEvolution(months: string[]): { month: string; total: number }[] {
  return months.map((month) => {
    const row = db.getFirstSync<{ total: number }>(
      "SELECT COALESCE(SUM(amount), 0) as total FROM transactions WHERE type = 'expense' AND substr(date, 1, 7) = ?",
      month
    );
    return { month, total: row?.total ?? 0 };
  });
}
