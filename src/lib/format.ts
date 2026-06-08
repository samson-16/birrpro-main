// Currency formatter for the Ethiopian Economics Association seed data.
// Displays values in Ethiopian Birr (ETB) — the function name is kept as
// `fmtUSD` for compatibility with existing imports across the app.
export const fmtUSD = (n: number) =>
  new Intl.NumberFormat("en-ET", { style: "currency", currency: "ETB", maximumFractionDigits: 2 }).format(n);

export const fmtCompact = (n: number) =>
  new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(n);
