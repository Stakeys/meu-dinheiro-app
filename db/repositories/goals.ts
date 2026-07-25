import { db } from "../client";
import type { Goal } from "../types";

export function listGoals(): Goal[] {
  return db.getAllSync<Goal>("SELECT * FROM goals ORDER BY id ASC");
}

export function createGoal(input: Omit<Goal, "id">): Goal {
  const result = db.runSync(
    "INSERT INTO goals (name, target_amount, current_amount, deadline, icon, color, image_uri) VALUES (?, ?, ?, ?, ?, ?, ?)",
    input.name,
    input.target_amount,
    input.current_amount,
    input.deadline,
    input.icon,
    input.color,
    input.image_uri
  );
  return { id: result.lastInsertRowId, ...input };
}

export function updateGoal(id: number, input: Omit<Goal, "id">): void {
  db.runSync(
    "UPDATE goals SET name = ?, target_amount = ?, current_amount = ?, deadline = ?, icon = ?, color = ?, image_uri = ? WHERE id = ?",
    input.name,
    input.target_amount,
    input.current_amount,
    input.deadline,
    input.icon,
    input.color,
    input.image_uri,
    id
  );
}

export function updateGoalImage(id: number, imageUri: string | null): void {
  db.runSync("UPDATE goals SET image_uri = ? WHERE id = ?", imageUri, id);
}

export function deleteGoal(id: number): void {
  db.runSync("DELETE FROM goals WHERE id = ?", id);
}

export function contributeToGoal(id: number, amount: number): void {
  db.runSync("UPDATE goals SET current_amount = current_amount + ? WHERE id = ?", amount, id);
}
