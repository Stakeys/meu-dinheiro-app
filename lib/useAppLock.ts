import * as LocalAuthentication from "expo-local-authentication";
import { useCallback, useEffect, useRef, useState } from "react";
import { AppState, type AppStateStatus } from "react-native";
import { useSettingsStore } from "../store/useSettingsStore";

export function useAppLock(ready: boolean) {
  const lockEnabled = useSettingsStore((s) => s.lock_enabled === "on");
  const [locked, setLocked] = useState(true);
  const appState = useRef<AppStateStatus>(AppState.currentState);
  const authenticating = useRef(false);

  const attemptUnlock = useCallback(async () => {
    if (!lockEnabled) {
      setLocked(false);
      return;
    }
    if (authenticating.current) return;
    authenticating.current = true;
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      if (!hasHardware || !isEnrolled) {
        setLocked(false);
        return;
      }
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Desbloqueie para acessar o MeuDinheiro",
        cancelLabel: "Cancelar",
        disableDeviceFallback: false,
      });
      setLocked(!result.success);
    } finally {
      authenticating.current = false;
    }
  }, [lockEnabled]);

  useEffect(() => {
    if (!ready) return;
    setLocked(lockEnabled);
    if (lockEnabled) attemptUnlock();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, lockEnabled]);

  useEffect(() => {
    if (!ready || !lockEnabled) return;
    const subscription = AppState.addEventListener("change", (next) => {
      // Só re-trava quando o app volta de "background" de verdade (home/app switcher).
      // "inactive" também é disparado enquanto o próprio painel de Face ID/código
      // está na tela, então tratá-lo como "saiu do app" gera um loop de autenticação.
      const cameFromBackground = appState.current === "background" && next === "active";
      appState.current = next;
      if (cameFromBackground) {
        setLocked(true);
        attemptUnlock();
      }
    });
    return () => subscription.remove();
  }, [ready, lockEnabled, attemptUnlock]);

  return { locked, retry: attemptUnlock };
}
