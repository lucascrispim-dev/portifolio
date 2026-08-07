"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChoiceButton } from "@/components/game/ChoiceButton";
import { NarratorText } from "@/components/game/NarratorText";
import { useEraTheme } from "@/components/game/EraThemeProvider";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { NarratorLine } from "@/types/game";

/**
 * Encerramento de Era com progresso mentiroso.
 *
 * O número exibido vem do conteúdo, não de cálculo: ele sobe, desce e
 * "recalcula" de propósito, para que o jogador nunca saiba onde está.
 * Quando `recalculatedLabel` existe, o primeiro valor é mostrado, o
 * sistema finge recalcular e revela um número **pior**.
 */
export function EraOutro({
  progressLabel,
  recalculatedLabel,
  recalculatedLines,
  lines,
  cta,
  onContinue,
}: {
  progressLabel: string;
  recalculatedLabel?: string;
  recalculatedLines?: NarratorLine[];
  lines: NarratorLine[];
  cta: string;
  onContinue: () => void;
}) {
  const theme = useEraTheme();
  const reducedMotion = useReducedMotion();
  const [phase, setPhase] = useState<"first" | "recalculating" | "final">(
    "first"
  );
  const [done, setDone] = useState(false);

  const showing =
    phase === "final" && recalculatedLabel ? recalculatedLabel : progressLabel;

  function handleFirstDone() {
    if (!recalculatedLabel) {
      setDone(true);
      return;
    }
    setPhase("recalculating");
    window.setTimeout(
      () => {
        setPhase("final");
      },
      reducedMotion ? 100 : 1600
    );
  }

  return (
    <div className="flex flex-1 flex-col justify-center gap-6">
      <div className="flex flex-col gap-1">
        <p className="font-mono text-[10px] tracking-[0.3em] opacity-60">
          PROGRESSO
        </p>
        <motion.p
          key={showing}
          initial={reducedMotion ? false : { opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-mono text-4xl tabular-nums"
          style={{ color: theme.accent }}
        >
          {showing}
        </motion.p>
        {phase === "recalculating" ? (
          <p className="font-mono text-xs opacity-60">Recalculando...</p>
        ) : null}
      </div>

      {phase !== "recalculating" ? (
        <NarratorText
          key={phase}
          lines={phase === "final" && recalculatedLines ? recalculatedLines : lines}
          onDone={phase === "first" ? handleFirstDone : () => setDone(true)}
        />
      ) : null}

      {done ? <ChoiceButton onClick={onContinue}>{cta}</ChoiceButton> : null}
    </div>
  );
}
