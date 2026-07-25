import { db } from "../client";
import type { Category } from "../types";

export function listCategories(): Category[] {
  return db.getAllSync<Category>("SELECT * FROM categories ORDER BY id ASC");
}

export function createCategory(input: Omit<Category, "id">): Category {
  const result = db.runSync(
    "INSERT INTO categories (name, icon, color, bucket) VALUES (?, ?, ?, ?)",
    input.name,
    input.icon,
    input.color,
    input.bucket
  );
  return { id: result.lastInsertRowId, ...input };
}

export function updateCategory(id: number, input: Omit<Category, "id">): void {
  db.runSync(
    "UPDATE categories SET name = ?, icon = ?, color = ?, bucket = ? WHERE id = ?",
    input.name,
    input.icon,
    input.color,
    input.bucket,
    id
  );
}

export function deleteCategory(id: number): void {
  db.runSync("DELETE FROM categories WHERE id = ?", id);
}
