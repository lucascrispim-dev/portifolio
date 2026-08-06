"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useEraTheme } from "@/components/game/EraThemeProvider";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const SETTLE_FRAMES = ["62%", "81%", "94%", "99%"];
const FLICKER_FRAMES = ["98%", "99%", "99%", "99%", "99%"];

/**
 * O indicador de compatibilidade — nunca chega a 100% dentro do site
 * (ver docs/roteiro, fio narrativo dos 99%). `flicker` reproduz a
 * hesitação das Eras VII/VIII (98% → 99% repetido antes de travar).
 */
export function CompatibilityMeter({
  flicker = false,
  onDone,
}: {
  flicker?: boolean;
  onDone?: () => void;
}) {
  const theme = useEraTheme();
  const reducedMotion = useReducedMotion();
  const frames = flicker ? FLICKER_FRAMES : SETTLE_FRAMES;
  const [frameIndex, setFrameIndex] = useState(reducedMotion ? frames.length - 1 : 0);
  const [easterEggMessage, setEasterEggMessage] = useState(false);

  useEffect(() => {
    if (reducedMotion) {
      onDone?.();
      return;
    }
    if (frameIndex >= frames.length - 1) {
      onDone?.();
      return;
    }
    const timeout = window.setTimeout(() => setFrameIndex((i) => i + 1), 420);
    return () => window.clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frameIndex, reducedMotion]);

  const value = frames[frameIndex];

  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <p className="text-xs font-semibold tracking-[0.25em] opacity-70">
        COMPATIBILIDADE
      </p>
      <motion.button
        type="button"
        aria-label={`Compatibilidade ${value}`}
        onClick={() => setEasterEggMessage(true)}
        className="font-mono text-6xl font-bold tabular-nums"
        style={{ color: theme.accent }}
        animate={reducedMotion ? undefined : { opacity: [0.6, 1] }}
        transition={{ duration: 0.25 }}
      >
        {value}
      </motion.button>
      {easterEggMessage ? (
        <p className="max-w-[220px] text-xs opacity-80">
          Não adianta clicar. Também estou curioso para descobrir esse 1%.
        </p>
      ) : null}
    </div>
  );
}
