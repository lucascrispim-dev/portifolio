"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useEraTheme } from "@/components/game/EraThemeProvider";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/** Múltiplos de 13 — a barra sempre trava em 99%, nunca chega a 100%. */
export const COMPATIBILITY_STEPS = [13, 26, 39, 52, 65, 78, 91, 99] as const;

export function CompatibilityBar({
  label = "CALCULANDO COMPATIBILIDADE",
  theOneEasterEgg = false,
  onTheOneFound,
  onDone,
}: {
  label?: string;
  theOneEasterEgg?: boolean;
  onTheOneFound?: () => void;
  onDone?: () => void;
}) {
  const theme = useEraTheme();
  const reducedMotion = useReducedMotion();
  const [stepIndex, setStepIndex] = useState(
    reducedMotion ? COMPATIBILITY_STEPS.length - 1 : 0
  );
  const [theOneMessage, setTheOneMessage] = useState(false);

  const value = COMPATIBILITY_STEPS[stepIndex];
  const settled = stepIndex >= COMPATIBILITY_STEPS.length - 1;

  useEffect(() => {
    if (settled) {
      const done = window.setTimeout(() => onDone?.(), reducedMotion ? 0 : 700);
      return () => window.clearTimeout(done);
    }
    // O último passo demora mais: é onde o jogador espera o 100% que não vem.
    const isLastStep = stepIndex === COMPATIBILITY_STEPS.length - 2;
    const timeout = window.setTimeout(
      () => setStepIndex((i) => i + 1),
      isLastStep ? 900 : 380
    );
    return () => window.clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepIndex, settled, reducedMotion]);

  function handleTheOne() {
    if (theOneMessage) return;
    setTheOneMessage(true);
    onTheOneFound?.();
  }

  return (
    <div className="flex w-full flex-col items-center gap-3 text-center">
      <p className="font-mono text-xs tracking-[0.25em] opacity-70">{label}</p>

      <div
        className="h-1.5 w-full max-w-xs overflow-hidden rounded-full"
        style={{ backgroundColor: `${theme.foreground}26` }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: theme.accent }}
          animate={{ width: `${value}%` }}
          transition={{ duration: reducedMotion ? 0 : 0.35, ease: "easeOut" }}
        />
      </div>

      <p
        className="font-mono text-6xl font-bold tabular-nums"
        style={{ color: theme.accent }}
      >
        {settled && theOneEasterEgg ? (
          <>
            9
            <button
              type="button"
              onClick={handleTheOne}
              aria-label="9"
              className="cursor-default focus-visible:outline focus-visible:outline-2"
            >
              9
            </button>
            <span aria-hidden>%</span>
          </>
        ) : (
          `${value}%`
        )}
      </p>

      {theOneMessage ? (
        <p className="max-w-[240px] text-sm leading-relaxed opacity-85">
          Você encontrou the 1.
          <br />
          Mas ainda não descobriu o que ele significa.
        </p>
      ) : null}
    </div>
  );
}
