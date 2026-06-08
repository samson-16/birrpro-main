import { cn } from "@/lib/utils";
import { useBrand } from "@/lib/brand-store";

/**
 * Brand mark.
 * - Renders an uploaded logo image (from Settings) when present.
 * - Falls back to the stylised "EEA" monogram.
 */
export function BrandLogo({ className, size = 32 }: { className?: string; size?: number }) {
  const { logoDataUrl, name } = useBrand();

  if (logoDataUrl) {
    return (
      <img
        src={logoDataUrl}
        alt={`${name} logo`}
        width={size}
        height={size}
        className={cn("shrink-0 object-contain rounded-md bg-white", className)}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      aria-label={`${name} logo`}
      role="img"
      className={cn("shrink-0", className)}
    >
      <defs>
        <linearGradient id="eea-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--primary)" />
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.75" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="60" height="60" rx="14" fill="url(#eea-grad)" />
      <text
        x="32"
        y="40"
        textAnchor="middle"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        fontWeight="800"
        fontSize="22"
        letterSpacing="1"
        fill="var(--primary-foreground)"
      >
        EEA
      </text>
    </svg>
  );
}
