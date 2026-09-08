import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef, type ReactNode } from "react";
import { RibbonDivider } from "./Ribbon";

export function Section({
  eyebrow,
  title,
  children,
  divider = true,
  flipDivider = false,
}: {
  eyebrow?: string;
  title?: string;
  children: ReactNode;
  divider?: boolean;
  flipDivider?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px -10% 0px" });
  const reduce = useReducedMotion();

  return (
    <section ref={ref} className="relative mx-auto w-full max-w-xl px-6 py-14">
      {divider && <RibbonDivider play={inView} flip={flipDivider} />}
      <motion.div
        initial={{ opacity: 0, y: reduce ? 0 : 22 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: reduce ? 0.001 : 0.9, delay: 0.25, ease: [0.22, 0.61, 0.28, 1] }}
      >
        {title && (
          <h2 className="text-center text-[2rem] leading-tight italic tracking-tight text-foreground">
            {title}
          </h2>
        )}
        {eyebrow && <p className="zar-eyebrow mt-2 text-center">{eyebrow}</p>}
        <div className="mt-8">{children}</div>
      </motion.div>
    </section>
  );
}
