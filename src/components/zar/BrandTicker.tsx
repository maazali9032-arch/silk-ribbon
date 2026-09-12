/**
 * Global floating brand strip. Intentionally tiny, semi-transparent and
 * pointer-events-none, floating near the 70% viewport-height mark.
 * The brand name is data-driven — it comes from the public RPC payload only.
 */
import { useEffect } from "react";
export function BrandTicker({ brandName }: { brandName?: string | null }) {
  const name = brandName?.trim() ?? "ZAR";


  const unit = (
    <span className="zar-eyebrow mx-4 inline-flex items-center gap-3 whitespace-nowrap text-zar-cream/70">
      {name}
      <span className="text-zar-saffron/80">✦</span>
      <span className="text-zar-cream/50">MADE WITH LOVE</span>
      <span className="text-zar-saffron/80">✦</span>
    </span>
  );

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed left-0 right-0 top-0 z-30 h-[1.6svh] min-h-[14px] overflow-hidden border-y border-zar-gold/25 bg-zar-burgundy-deep/25 backdrop-blur-[1px]"
    >
      <div
        className="zar-marquee-track flex h-full w-max items-center"
        style={{ animation: "zar-marquee 26s linear infinite" }}
      >
        <span className="flex">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={`a${i}`}>{unit}</span>
          ))}
        </span>
        <span className="flex">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={`b${i}`}>{unit}</span>
          ))}
        </span>
      </div>
    </div>
  );
}
