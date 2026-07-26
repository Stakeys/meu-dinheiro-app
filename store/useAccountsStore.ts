import { create } from "zustand";
import * as repo from "../db/repositories/accounts";
import type { Account } from "../db/types";

type State = {
  items: Account[];
  refresh: () => void;
  add: (input: Omit<Account, "id">) => Account;
  edit: (id: number, input: Omit<Account, "id">) => void;
  remove: (id: number) => void;
};

export const useAccountsStore = create<State>((set, get) => ({
  items: [],
  refresh: () => set({ items: repo.listAccounts() }),
  add: (input) => {
    const created = repo.createAccount(input);
    get().refresh();
    return created;
  },
  edit: (id, input) => {
    repo.updateAccount(id, input);
    get().refresh();
  },
  remove: (id) => {
    repo.deleteAccount(id);
    get().refresh();
  },
}));
