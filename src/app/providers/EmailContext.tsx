"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
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

// null default lets useEmail() detect a missing provider
const EmailContext = createContext<EmailContextValue | null>(null);

export function EmailProvider({ children }: { children: ReactNode }) {
  const [email, setEmailState] = useState("");
  const [ready, setReady] = useState(false);

  // sessionStorage doesn't exist on the server, so restore after mount.
  // Reading it during the first render would cause a hydration mismatch.
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) setEmailState(saved);
    } catch {
      // storage can be blocked (private mode), so fall back to memory only
    }
    setReady(true);
  }, []);

  const setContextEmail = useCallback((value: string) => {
    const normalized = value.trim().toLowerCase();
    setEmailState(normalized);
    try {
      sessionStorage.setItem(STORAGE_KEY, normalized);
    } catch {}
  }, []);

  const clearEmail = useCallback(() => {
    setEmailState("");
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {}
  }, []);

  // Memoised, so consumers only re-render when something really changed
  const value = useMemo(
    () => ({ email, setContextEmail, clearEmail, ready }),
    [email, setContextEmail, clearEmail, ready],
  );

  return (
    <EmailContext.Provider value={value}>{children}</EmailContext.Provider>
  );
}

/** Hook for reading and updating the email. Throws if used outside the provider. */
export function useEmail() {
  const ctx = useContext(EmailContext);
  if (!ctx) throw new Error("useEmail must be used inside <EmailProvider>");
  return ctx;
}
