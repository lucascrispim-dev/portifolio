"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChoiceButton } from "@/components/game/ChoiceButton";
import { NarratorText } from "@/components/game/NarratorText";
import { SystemBlock } from "@/components/game/SystemBlock";
import { useEraTheme } from "@/components/game/EraThemeProvider";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { getSystemError } from "@/content/system-errors";
import { pace } from "@/lib/pacing";
import type { NarratorLine, SystemErrorId } from "@/types/game";

type Phase = "failing" | "working" | "resolved" | "after";

/**
 * Uma falha do sistema.
 *
 * O truque é o tempo. A tela quebra sem aviso e **não oferece nada para
 * o jogador fazer** — ele só assiste, sem saber se aquilo é parte do
 * jogo ou se o presente do namorado quebrou de verdade. Só depois de
 * alguns segundos o sistema se recupera sozinho, encontra alguém para
 * culpar e segue como se nada tivesse acontecido.
 *
 * Nenhuma destas falhas é aleatória: cada uma está posicionada numa Era
 * específica, e a repetição é o que ensina o jogador que "quebrar" é uma
 * das coisas que este sistema faz de propósito. É o que deixa o ERRO 13,
 * mais adiante, com chance real de enganar.
 */
export function SystemInterrupt({
  error,
  extraLines,
  onSeen,
  onContinue,
  cta = "CONTINUAR",
}: {
  error: SystemErrorId;
  extraLines?: NarratorLine[];
  /** Contabiliza a falha nas estatísticas. */
  onSeen: () => void;
  onContinue: () => void;
  cta?: string;
}) {
  const spec = getSystemError(error);
  const theme = useEraTheme();
  const reducedMotion = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("failing");
  const [afterDone, setAfterDone] = useState(false);

  useEffect(() => {
    onSeen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** A recuperação acontece sozinha, em três tempos. */
  useEffect(() => {
    const next: Partial<Record<Phase, { to: Phase; ms: number }>> = {
      failing: { to: "working", ms: 1500 },
      working: { to: "resolved", ms: 2200 },
      resolved: { to: "after", ms: 1400 },
    };
    const step = next[phase];
    if (!step) return;
    const timer = window.setTimeout(
      () => setPhase(step.to),
      pace(step.ms, reducedMotion)
    );
    return () => window.clearTimeout(timer);
  }, [phase, reducedMotion]);

  const lines = [...spec.after, ...(extraLines ?? [])];

  return (
    <div className="flex flex-1 flex-col justify-center gap-6">
      <motion.p
        initial={reducedMotion ? false : { opacity: 0, x: -6 }}
        animate={
          reducedMotion || phase !== "failing"
            ? { opacity: 1, x: 0 }
            : { opacity: [1, 0.35, 1], x: [0, 3, -2, 0] }
        }
        transition={{ duration: 0.6, repeat: phase === "failing" ? Infinity : 0 }}
        className="font-mono text-sm tracking-[0.22em] text-red-400"
      >
        {spec.code}
      </motion.p>

      <SystemBlock lines={spec.detail} />

      {phase === "working" ? (
        <p className="font-mono text-xs tracking-[0.18em] opacity-60">
          Aplicando correção...
        </p>
      ) : null}

      {phase === "resolved" || phase === "after" ? (
        <motion.p
          initial={reducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-mono text-sm tracking-[0.22em]"
          style={{ color: theme.accent }}
        >
          {spec.resolution}
        </motion.p>
      ) : null}

      {phase === "after" ? (
        <div className="flex flex-col gap-5">
          <NarratorText lines={lines} onDone={() => setAfterDone(true)} />
          {afterDone ? (
            <ChoiceButton onClick={onContinue}>{cta}</ChoiceButton>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
