import { create } from "zustand";
import * as repo from "../db/repositories/categories";
import type { Category } from "../db/types";

type State = {
  items: Category[];
  refresh: () => void;
  add: (input: Omit<Category, "id">) => Category;
  edit: (id: number, input: Omit<Category, "id">) => void;
  remove: (id: number) => void;
};

export const useCategoriesStore = create<State>((set, get) => ({
  items: [],
  refresh: () => set({ items: repo.listCategories() }),
  add: (input) => {
    const created = repo.createCategory(input);
    get().refresh();
    return created;
  },
  edit: (id, input) => {
    repo.updateCategory(id, input);
    get().refresh();
  },
  remove: (id) => {
    repo.deleteCategory(id);
    get().refresh();
  },
}));
