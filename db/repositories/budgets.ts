import { db } from "../client";
import type { Budget } from "../types";

export function listBudgetsByMonth(month: string): Budget[] {
  return db.getAllSync<Budget>("SELECT * FROM budgets WHERE month = ? ORDER BY id ASC", month);
}

export function upsertBudget(input: Omit<Budget, "id">): Budget {
  const existing = db.getFirstSync<Budget>(
    "SELECT * FROM budgets WHERE category_id = ? AND month = ?",
    input.category_id,
    input.month
  );
  if (existing) {
    db.runSync("UPDATE budgets SET limit_amount = ? WHERE id = ?", input.limit_amount, existing.id);
    return { ...existing, limit_amount: input.limit_amount };
  }
  const result = db.runSync(
    "INSERT INTO budgets (category_id, month, limit_amount) VALUES (?, ?, ?)",
    input.category_id,
    input.month,
    input.limit_amount
  );
  return { id: result.lastInsertRowId, ...input };
}

export function deleteBudget(id: number): void {
  db.runSync("DELETE FROM budgets WHERE id = ?", id);
}
