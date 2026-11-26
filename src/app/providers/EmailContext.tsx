"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

const STORAGE_KEY = "pin-rotator:email";

type EmailContextValue = {
  email: string;
  setContextEmail: (email: string) => void;
  clearEmail: () => void;
  /** false until the saved email has been read, so pages don't redirect too early */
  ready: boolean;
};

const EmailContext = createContext<EmailContextValue | null>(null);

const emptySubscribe = () => () => {};

function useIsClient() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

function readStoredEmail(): string {
  if (typeof window === "undefined") return "";
  try {
    return sessionStorage.getItem(STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
}

export function EmailProvider({ children }: { children: ReactNode }) {
  const ready = useIsClient();
  const [emailOverride, setEmailOverride] = useState<string | null>(null);

  const email = ready ? (emailOverride ?? readStoredEmail()) : "";

  const setContextEmail = useCallback((value: string) => {
    const normalized = value.trim().toLowerCase();
    setEmailOverride(normalized);
    try {
      sessionStorage.setItem(STORAGE_KEY, normalized);
    } catch {}
  }, []);

  const clearEmail = useCallback(() => {
    setEmailOverride("");
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {}
  }, []);

  const value = useMemo(
    () => ({ email, setContextEmail, clearEmail, ready }),
    [email, setContextEmail, clearEmail, ready],
  );

  return (
    <EmailContext.Provider value={value}>{children}</EmailContext.Provider>
  );
}

export function useEmail() {
  const ctx = useContext(EmailContext);
  if (!ctx) throw new Error("useEmail must be used inside <EmailProvider>");
  return ctx;
}
