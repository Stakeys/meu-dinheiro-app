import { create } from "zustand";
import * as repo from "../db/repositories/transactions";
import type { Transaction } from "../db/types";
import { useAccountsStore } from "./useAccountsStore";

type State = {
  items: Transaction[];
  refresh: () => void;
  add: (input: Omit<Transaction, "id">) => void;
  edit: (id: number, input: Omit<Transaction, "id">) => void;
  remove: (id: number) => void;
};

export const useTransactionsStore = create<State>((set, get) => ({
  items: [],
  refresh: () => set({ items: repo.listTransactions() }),
  add: (input) => {
    repo.createTransaction(input);
    get().refresh();
    useAccountsStore.getState().refresh();
  },
  edit: (id, input) => {
    repo.updateTransaction(id, input);
    get().refresh();
    useAccountsStore.getState().refresh();
  },
  remove: (id) => {
    repo.deleteTransaction(id);
    get().refresh();
    useAccountsStore.getState().refresh();
  },
}));
