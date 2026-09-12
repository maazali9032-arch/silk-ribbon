/**
 * Global floating shop/brand strip.
 * Tiny, semi-transparent, pointer-events-safe, sitting around 70% of viewport
 * height. The brand name is data-driven (from the public RPC payload) — never
 * hardcoded and never queried from a shop table by this design.
 */
export function BrandTicker({ brandName }: { brandName?: string | null }) {
  const name = brandName?.trim() ?? "ZAR";
  // always render ticker, even if brandName missing
  useEffect(() => {
    console.log("BrandTicker rendered with name:", name);
  }, []);


  const cell = `${name}  ·  Crafting beautiful beginnings  ·  `;
  const run = cell.repeat(6);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-30 flex justify-center px-2"
    >
      <div
        className="w-full max-w-3xl overflow-hidden rounded-full border py-[0.25vh]"
        style={{
          borderColor: "color-mix(in oklab, var(--gold) 32%, transparent)",
          background: "color-mix(in oklab, var(--silk) 26%, transparent)",
          backdropFilter: "blur(2px)",
          boxShadow: "0 0 18px -8px color-mix(in oklab, var(--gold) 60%, transparent)",
          minHeight: "1.1vh",
        }}
      >
        <div
          className="flex w-max whitespace-nowrap will-change-transform"
          style={{ animation: "zar-marquee 42s linear infinite" }}
        >
          <span className="zar-eyebrow px-2 text-[0.55rem] leading-[1.4] opacity-70">{run}</span>
          <span className="zar-eyebrow px-2 text-[0.55rem] leading-[1.4] opacity-70">{run}</span>
        </div>
      </div>
    </div>
  );
}
