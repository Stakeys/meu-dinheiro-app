import { format } from "date-fns";
import { create } from "zustand";
import * as repo from "../db/repositories/budgets";
import type { Budget } from "../db/types";

type State = {
  month: string;
  items: Budget[];
  refresh: () => void;
  setMonth: (month: string) => void;
  save: (input: Omit<Budget, "id">) => void;
  remove: (id: number) => void;
};

export const useBudgetsStore = create<State>((set, get) => ({
  month: format(new Date(), "yyyy-MM"),
  items: [],
  refresh: () => set({ items: repo.listBudgetsByMonth(get().month) }),
  setMonth: (month) => {
    set({ month });
    get().refresh();
  },
  save: (input) => {
    repo.upsertBudget(input);
    get().refresh();
  },
  remove: (id) => {
    repo.deleteBudget(id);
    get().refresh();
  },
}));
