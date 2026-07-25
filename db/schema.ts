import { db } from "./client";

const DATABASE_VERSION = 2;

export function migrateDbIfNeeded() {
  const row = db.getFirstSync<{ user_version: number }>("PRAGMA user_version");
  const currentVersion = row?.user_version ?? 0;

  if (currentVersion >= DATABASE_VERSION) return;

  if (currentVersion < 1) {
    db.execSync(`
      PRAGMA journal_mode = 'wal';

      CREATE TABLE IF NOT EXISTS accounts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        balance REAL NOT NULL DEFAULT 0,
        color TEXT NOT NULL DEFAULT '#7C3AED',
        icon TEXT NOT NULL DEFAULT 'wallet'
      );

      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        icon TEXT NOT NULL DEFAULT 'ellipsis-horizontal',
        color TEXT NOT NULL DEFAULT '#94A3B8',
        bucket TEXT NOT NULL DEFAULT 'outros'
      );

      CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        account_id INTEGER NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
        category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
        type TEXT NOT NULL,
        amount REAL NOT NULL,
        description TEXT NOT NULL DEFAULT '',
        date TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS budgets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
        month TEXT NOT NULL,
        limit_amount REAL NOT NULL,
        UNIQUE(category_id, month)
      );

      CREATE TABLE IF NOT EXISTS goals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        target_amount REAL NOT NULL,
        current_amount REAL NOT NULL DEFAULT 0,
        deadline TEXT,
        icon TEXT NOT NULL DEFAULT 'flag',
        color TEXT NOT NULL DEFAULT '#7C3AED'
      );

      CREATE TABLE IF NOT EXISTS investments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        type TEXT NOT NULL DEFAULT 'outro',
        invested_amount REAL NOT NULL,
        current_amount REAL NOT NULL,
        date TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      );
    `);
  }

  if (currentVersion < 2) {
    db.execSync(`ALTER TABLE goals ADD COLUMN image_uri TEXT;`);
  }

  db.execSync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}

// Verificação defensiva: garante que colunas críticas existem de fato na tabela,
// independente do que o contador de versão diz. Protege contra dispositivos onde
// user_version e a estrutura real ficaram dessincronizados (ex.: hot reload
// pulando uma migração).
export function ensureColumnsExist() {
  console.log("[schema] BUILD_TAG check-2026-07-25-b");
  const goalColumns = db.getAllSync<{ name: string }>("PRAGMA table_info(goals)");
  console.log("[schema] goals columns:", JSON.stringify(goalColumns.map((c) => c.name)));
  const hasImageUri = goalColumns.some((c) => c.name === "image_uri");
  console.log("[schema] hasImageUri:", hasImageUri);
  if (!hasImageUri) {
    console.log("[schema] adding image_uri column now");
    db.execSync(`ALTER TABLE goals ADD COLUMN image_uri TEXT;`);
    console.log("[schema] column added");
  }
}
