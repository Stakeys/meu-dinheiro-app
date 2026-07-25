import { db } from "../client";
import type { Investment } from "../types";

export function listInvestments(): Investment[] {
  return db.getAllSync<Investment>("SELECT * FROM investments ORDER BY id ASC");
}

export function createInvestment(input: Omit<Investment, "id">): Investment {
  const result = db.runSync(
    "INSERT INTO investments (name, type, invested_amount, current_amount, date) VALUES (?, ?, ?, ?, ?)",
    input.name,
    input.type,
    input.invested_amount,
    input.current_amount,
    input.date
  );
  return { id: result.lastInsertRowId, ...input };
}

export function updateInvestment(id: number, input: Omit<Investment, "id">): void {
  db.runSync(
    "UPDATE investments SET name = ?, type = ?, invested_amount = ?, current_amount = ?, date = ? WHERE id = ?",
    input.name,
    input.type,
    input.invested_amount,
    input.current_amount,
    input.date,
    id
  );
}

export function deleteInvestment(id: number): void {
  db.runSync("DELETE FROM investments WHERE id = ?", id);
}
