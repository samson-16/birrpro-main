import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { BRAND as DEFAULT_BRAND } from "@/lib/brand";

type BrandOverrides = {
  name?: string;
  logoDataUrl?: string;
};

type BrandContextValue = {
  name: string;
  logoDataUrl: string | null;
  setName: (n: string) => void;
  setLogoDataUrl: (url: string | null) => void;
  reset: () => void;
};

const STORAGE_KEY = "eea.brand.overrides";
const BrandContext = createContext<BrandContextValue | null>(null);

function readOverrides(): BrandOverrides {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as BrandOverrides) : {};
  } catch {
    return {};
  }
}

function writeOverrides(o: BrandOverrides) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(o));
  } catch {
    /* quota exceeded — ignore */
  }
}

export function BrandProvider({ children }: { children: ReactNode }) {
  const [overrides, setOverrides] = useState<BrandOverrides>({});

  useEffect(() => {
    setOverrides(readOverrides());
  }, []);

  const value = useMemo<BrandContextValue>(() => ({
    name: overrides.name?.trim() || DEFAULT_BRAND.name,
    logoDataUrl: overrides.logoDataUrl ?? null,
    setName: (n) => {
      const next = { ...overrides, name: n };
      setOverrides(next);
      writeOverrides(next);
    },
    setLogoDataUrl: (url) => {
      const next = { ...overrides, logoDataUrl: url ?? undefined };
      setOverrides(next);
      writeOverrides(next);
    },
    reset: () => {
      setOverrides({});
      writeOverrides({});
    },
  }), [overrides]);

  return <BrandContext.Provider value={value}>{children}</BrandContext.Provider>;
}

/** Safe to call outside provider — falls back to defaults. */
export function useBrand(): BrandContextValue {
  const ctx = useContext(BrandContext);
  if (ctx) return ctx;
  return {
    name: DEFAULT_BRAND.name,
    logoDataUrl: null,
    setName: () => {},
    setLogoDataUrl: () => {},
    reset: () => {},
  };
}

/** Read the latest stored logo synchronously (for CSV/PDF generators called outside React). */
export function readStoredLogoDataUrl(): string | null {
  return readOverrides().logoDataUrl ?? null;
}

/** Read the active org name (override or default) outside React. */
export function readStoredBrandName(): string {
  return readOverrides().name?.trim() || DEFAULT_BRAND.name;
}
