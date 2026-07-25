import { useEffect, useState } from "react";
import { migrateDbIfNeeded } from "../db/schema";
import { seedDemoData as seedDemoDataDb, clearAllData as clearAllDataDb } from "../db/seed";
import { useAccountsStore } from "./useAccountsStore";
import { useBudgetsStore } from "./useBudgetsStore";
import { useCategoriesStore } from "./useCategoriesStore";
import { useGoalsStore } from "./useGoalsStore";
import { useInvestmentsStore } from "./useInvestmentsStore";
import { useSettingsStore } from "./useSettingsStore";
import { useTransactionsStore } from "./useTransactionsStore";

function refreshAll() {
  useAccountsStore.getState().refresh();
  useCategoriesStore.getState().refresh();
  useTransactionsStore.getState().refresh();
  useBudgetsStore.getState().refresh();
  useGoalsStore.getState().refresh();
  useInvestmentsStore.getState().refresh();
  useSettingsStore.getState().refresh();
}

export function useAppInit() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    migrateDbIfNeeded();
    refreshAll();
    setReady(true);
  }, []);

  return { ready };
}

export function seedDemoData() {
  seedDemoDataDb();
  refreshAll();
}

export function clearAllData() {
  clearAllDataDb();
  refreshAll();
}
