import { create } from "zustand";
import * as repo from "../db/repositories/goals";
import type { Goal } from "../db/types";

type State = {
  items: Goal[];
  refresh: () => void;
  add: (input: Omit<Goal, "id">) => void;
  edit: (id: number, input: Omit<Goal, "id">) => void;
  remove: (id: number) => void;
  contribute: (id: number, amount: number) => void;
  setImage: (id: number, imageUri: string | null) => void;
};

export const useGoalsStore = create<State>((set, get) => ({
  items: [],
  refresh: () => set({ items: repo.listGoals() }),
  add: (input) => {
    repo.createGoal(input);
    get().refresh();
  },
  edit: (id, input) => {
    repo.updateGoal(id, input);
    get().refresh();
  },
  remove: (id) => {
    repo.deleteGoal(id);
    get().refresh();
  },
  contribute: (id, amount) => {
    repo.contributeToGoal(id, amount);
    get().refresh();
  },
  setImage: (id, imageUri) => {
    repo.updateGoalImage(id, imageUri);
    get().refresh();
  },
}));
