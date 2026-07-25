import { create } from "zustand";
import * as repo from "../db/repositories/investments";
import type { Investment } from "../db/types";

type State = {
  items: Investment[];
  refresh: () => void;
  add: (input: Omit<Investment, "id">) => void;
  edit: (id: number, input: Omit<Investment, "id">) => void;
  remove: (id: number) => void;
};

export const useInvestmentsStore = create<State>((set, get) => ({
  items: [],
  refresh: () => set({ items: repo.listInvestments() }),
  add: (input) => {
    repo.createInvestment(input);
    get().refresh();
  },
  edit: (id, input) => {
    repo.updateInvestment(id, input);
    get().refresh();
  },
  remove: (id) => {
    repo.deleteInvestment(id);
    get().refresh();
  },
}));
