import { db } from "../client";
import type { SettingsMap } from "../types";

const DEFAULTS: SettingsMap = {
  theme: "pulse",
  currency: "BRL",
  user_name: "Você",
  avatar_uri: "",
  lock_enabled: "on",
};

export function getSetting<K extends keyof SettingsMap>(key: K): SettingsMap[K] {
  const row = db.getFirstSync<{ value: string }>("SELECT value FROM settings WHERE key = ?", key);
  return (row?.value as SettingsMap[K]) ?? DEFAULTS[key];
}

export function getAllSettings(): SettingsMap {
  return {
    theme: getSetting("theme"),
    currency: getSetting("currency"),
    user_name: getSetting("user_name"),
    avatar_uri: getSetting("avatar_uri"),
    lock_enabled: getSetting("lock_enabled"),
  };
}

export function setSetting<K extends keyof SettingsMap>(key: K, value: SettingsMap[K]): void {
  db.runSync(
    "INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value",
    key,
    value
  );
}
