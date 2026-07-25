import { create } from "zustand";
import { getAllSettings, setSetting } from "../db/repositories/settings";
import type { SettingsMap } from "../db/types";

type State = SettingsMap & {
  refresh: () => void;
  setTheme: (theme: SettingsMap["theme"]) => void;
  setUserName: (name: string) => void;
  setCurrency: (currency: string) => void;
  setAvatar: (uri: string) => void;
};

export const useSettingsStore = create<State>((set) => ({
  theme: "pulse",
  currency: "BRL",
  user_name: "Você",
  avatar_uri: "",
  refresh: () => set(getAllSettings()),
  setTheme: (theme) => {
    setSetting("theme", theme);
    set({ theme });
  },
  setUserName: (user_name) => {
    setSetting("user_name", user_name);
    set({ user_name });
  },
  setCurrency: (currency) => {
    setSetting("currency", currency);
    set({ currency });
  },
  setAvatar: (avatar_uri) => {
    setSetting("avatar_uri", avatar_uri);
    set({ avatar_uri });
  },
}));
