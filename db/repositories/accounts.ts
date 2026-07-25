import { db } from "../client";
import type { Account } from "../types";

export function listAccounts(): Account[] {
  return db.getAllSync<Account>("SELECT * FROM accounts ORDER BY id ASC");
}

export function createAccount(input: Omit<Account, "id">): Account {
  const result = db.runSync(
    "INSERT INTO accounts (name, type, balance, color, icon) VALUES (?, ?, ?, ?, ?)",
    input.name,
    input.type,
    input.balance,
    input.color,
    input.icon
  );
  return { id: result.lastInsertRowId, ...input };
}

export function updateAccount(id: number, input: Omit<Account, "id">): void {
  db.runSync(
    "UPDATE accounts SET name = ?, type = ?, balance = ?, color = ?, icon = ? WHERE id = ?",
    input.name,
    input.type,
    input.balance,
    input.color,
    input.icon,
    id
  );
}

export function deleteAccount(id: number): void {
  db.runSync("DELETE FROM accounts WHERE id = ?", id);
}

export function recalculateAccountBalance(accountId: number): void {
  const row = db.getFirstSync<{ total: number }>(
    `SELECT COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END), 0) as total
     FROM transactions WHERE account_id = ?`,
    accountId
  );
  db.runSync("UPDATE accounts SET balance = ? WHERE id = ?", row?.total ?? 0, accountId);
}
