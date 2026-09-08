import { motion, useReducedMotion } from "motion/react";
import { useId, type ReactNode } from "react";

/**
 * Silk ribbon construction primitives.
 * Ribbons are SVG bezier bands that visibly travel in and settle into their
 * final geometry using pathLength drawing plus a soft transform settle.
 */

type Band = {
  d: string;
  width: number;
  opacity: number;
  from: { x: number; y: number; rotate: number };
  delay: number;
  duration: number;
};

function SilkDefs({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={`${id}-a`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="oklch(0.94 0.03 40)" />
        <stop offset="35%" stopColor="oklch(0.99 0.02 80)" />
        <stop offset="60%" stopColor="oklch(0.83 0.06 22)" />
        <stop offset="100%" stopColor="oklch(0.9 0.05 70)" />
      </linearGradient>
      <linearGradient id={`${id}-b`} x1="1" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="oklch(0.88 0.05 70)" />
        <stop offset="45%" stopColor="oklch(0.98 0.02 85)" />
        <stop offset="100%" stopColor="oklch(0.86 0.05 25)" />
      </linearGradient>
      <filter id={`${id}-soft`} x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="1.4" />
      </filter>
    </defs>
  );
}

function RibbonBands({
  bands,
  gradientId,
  play,
  loopFloat,
}: {
  bands: Band[];
  gradientId: string;
  play: boolean;
  loopFloat?: boolean;
}) {
  const reduce = useReducedMotion();

  return (
    <>
      {bands.map((band, i) => (
        <motion.g
          key={i}
          initial={{
            x: band.from.x,
            y: band.from.y,
            rotate: band.from.rotate,
            opacity: 0,
          }}
          animate={
            play
              ? {
                  x: 0,
                  y: 0,
                  rotate: 0,
                  opacity: band.opacity,
                  ...(loopFloat && !reduce ? { translateY: [0, -4, 0] } : {}),
                }
              : {}
          }
          transition={{
            duration: reduce ? 0.001 : band.duration,
            delay: reduce ? 0 : band.delay,
            ease: [0.22, 0.61, 0.28, 1],
            ...(loopFloat && !reduce
              ? { translateY: { duration: 9 + i, repeat: Infinity, ease: "easeInOut" } }
              : {}),
          }}
          style={{ transformOrigin: "50% 50%" }}
        >
          <motion.path
            d={band.d}
            fill="none"
            stroke={`url(#${gradientId}-${i % 2 === 0 ? "a" : "b"})`}
            strokeWidth={band.width}
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={play ? { pathLength: 1 } : {}}
            transition={{
              duration: reduce ? 0.001 : band.duration * 1.15,
              delay: reduce ? 0 : band.delay,
              ease: [0.33, 0.02, 0.2, 1],
            }}
          />
          <motion.path
            d={band.d}
            fill="none"
            stroke="oklch(0.995 0.01 90)"
            strokeWidth={Math.max(1, band.width * 0.16)}
            strokeLinecap="round"
            opacity={0.75}
            filter={`url(#${gradientId}-soft)`}
            initial={{ pathLength: 0 }}
            animate={play ? { pathLength: 1 } : {}}
            transition={{
              duration: reduce ? 0.001 : band.duration * 1.15,
              delay: reduce ? 0 : band.delay + 0.08,
              ease: [0.33, 0.02, 0.2, 1],
            }}
          />
        </motion.g>
      ))}
    </>
  );
}

/** Ambient silk field for the opening — one slow moving ribbon edge. */
export function SilkField({ play = true }: { play?: boolean }) {
  const id = useId().replace(/:/g, "");
  const bands: Band[] = [
    {
      d: "M-40 250 C 80 160, 140 340, 260 250 S 420 140, 540 230",
      width: 34,
      opacity: 0.5,
      from: { x: -180, y: 40, rotate: -6 },
      delay: 0.2,
      duration: 2.6,
    },
    {
      d: "M-30 420 C 110 360, 180 520, 300 430 S 450 320, 540 400",
      width: 18,
      opacity: 0.32,
      from: { x: 200, y: 60, rotate: 5 },
      delay: 0.9,
      duration: 3,
    },
  ];
  return (
    <svg
      viewBox="0 0 500 640"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
    >
      <SilkDefs id={id} />
      <RibbonBands bands={bands} gradientId={id} play={play} loopFloat />
    </svg>
  );
}

/** Hero frame: ribbons travel in and settle into a frame around the names. */
export function RibbonFrame({ play = true }: { play?: boolean }) {
  const id = useId().replace(/:/g, "");
  const bands: Band[] = [
    {
      d: "M60 90 C 30 200, 30 420, 70 540",
      width: 22,
      opacity: 0.6,
      from: { x: -220, y: -80, rotate: -14 },
      delay: 0.15,
      duration: 2.1,
    },
    {
      d: "M440 90 C 470 200, 470 420, 430 540",
      width: 22,
      opacity: 0.6,
      from: { x: 220, y: -80, rotate: 14 },
      delay: 0.35,
      duration: 2.1,
    },
    {
      d: "M60 90 C 160 30, 340 30, 440 90",
      width: 16,
      opacity: 0.55,
      from: { x: 0, y: -180, rotate: 8 },
      delay: 0.75,
      duration: 1.9,
    },
    {
      d: "M70 540 C 170 600, 330 600, 430 540",
      width: 16,
      opacity: 0.5,
      from: { x: 0, y: 180, rotate: -8 },
      delay: 1.0,
      duration: 1.9,
    },
    {
      d: "M120 150 C 220 110, 280 190, 380 140",
      width: 7,
      opacity: 0.42,
      from: { x: -120, y: -30, rotate: -10 },
      delay: 1.35,
      duration: 1.6,
    },
  ];
  return (
    <svg
      viewBox="0 0 500 640"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
    >
      <SilkDefs id={id} />
      <RibbonBands bands={bands} gradientId={id} play={play} loopFloat />
    </svg>
  );
}

/** A ribbon that weaves itself into a section separator. */
export function RibbonDivider({ play = true, flip = false }: { play?: boolean; flip?: boolean }) {
  const id = useId().replace(/:/g, "");
  const bands: Band[] = [
    {
      d: flip
        ? "M10 30 C 90 4, 150 56, 230 30 S 330 6, 390 30"
        : "M10 30 C 80 56, 140 4, 220 30 S 320 54, 390 30",
      width: 9,
      opacity: 0.7,
      from: { x: flip ? 90 : -90, y: 0, rotate: 0 },
      delay: 0,
      duration: 1.5,
    },
    {
      d: flip
        ? "M20 38 C 100 14, 160 64, 240 38 S 340 16, 385 38"
        : "M20 22 C 100 46, 160 -4, 240 22 S 340 44, 385 22",
      width: 3,
      opacity: 0.45,
      from: { x: flip ? -60 : 60, y: 6, rotate: 0 },
      delay: 0.25,
      duration: 1.5,
    },
  ];
  return (
    <svg
      viewBox="0 0 400 60"
      className="pointer-events-none mx-auto h-10 w-full max-w-sm"
      aria-hidden="true"
    >
      <SilkDefs id={id} />
      <RibbonBands bands={bands} gradientId={id} play={play} />
    </svg>
  );
}

/** Corner silk that settles behind a card. */
export function RibbonCorner({ play = true, side = "left" }: { play?: boolean; side?: "left" | "right" }) {
  const id = useId().replace(/:/g, "");
  const bands: Band[] = [
    {
      d:
        side === "left"
          ? "M-10 160 C 60 120, 40 40, 130 10"
          : "M210 160 C 140 120, 160 40, 70 10",
      width: 18,
      opacity: 0.45,
      from: { x: side === "left" ? -120 : 120, y: 60, rotate: side === "left" ? -12 : 12 },
      delay: 0.1,
      duration: 1.8,
    },
    {
      d:
        side === "left"
          ? "M-6 178 C 70 140, 56 60, 150 26"
          : "M206 178 C 130 140, 144 60, 50 26",
      width: 6,
      opacity: 0.35,
      from: { x: side === "left" ? -80 : 80, y: 40, rotate: 0 },
      delay: 0.35,
      duration: 1.8,
    },
  ];
  return (
    <svg
      viewBox="0 0 200 190"
      className={`pointer-events-none absolute -z-0 h-40 w-40 ${side === "left" ? "-left-6 -top-6" : "-right-6 -bottom-6"}`}
      aria-hidden="true"
    >
      <SilkDefs id={id} />
      <RibbonBands bands={bands} gradientId={id} play={play} loopFloat />
    </svg>
  );
}

export function Ornament({ children }: { children?: ReactNode }) {
  return (
    <div className="flex items-center justify-center gap-3">
      <span className="zar-gold-rule h-px w-12" />
      <span className="text-gold text-xs">✦</span>
      {children}
      <span className="zar-gold-rule h-px w-12" />
    </div>
  );
}
