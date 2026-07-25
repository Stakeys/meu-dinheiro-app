import { create } from "zustand";
import { getAllSettings, setSetting } from "../db/repositories/settings";
import type { SettingsMap } from "../db/types";

type State = SettingsMap & {
  refresh: () => void;
  setTheme: (theme: SettingsMap["theme"]) => void;
  setUserName: (name: string) => void;
  setCurrency: (currency: string) => void;
  setAvatar: (uri: string) => void;
  setLockEnabled: (enabled: boolean) => void;
};

export const useSettingsStore = create<State>((set) => ({
  theme: "pulse",
  currency: "BRL",
  user_name: "Você",
  avatar_uri: "",
  lock_enabled: "on",
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
  setLockEnabled: (enabled) => {
    const lock_enabled = enabled ? "on" : "off";
    setSetting("lock_enabled", lock_enabled);
    set({ lock_enabled });
  },
}));
