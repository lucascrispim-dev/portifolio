"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { NarratorText } from "@/components/game/NarratorText";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { projectConfig } from "@/config/project";
import { pace, tick } from "@/lib/pacing";
import {
  confessionIntro,
  confessionNarrator,
  dataOriginSteps,
  declaration,
  transitionToFirstPerson,
} from "@/content/final-script";

type Step = "silence" | "intro" | "narrator" | "origin" | "transition" | "declaration";

/**
 * O narrador se dissolve. A tabela ORIGEM DE DADOS migra a autoria dele
 * para o Lucas, e a partir daí o texto vira primeira pessoa — o jogo para
 * de ser um jogo.
 *
 * Tudo roda sozinho: depois do ENCERRAR o jogador não tem mais nenhuma
 * decisão a tomar.
 */
export function ConfessionSequence({ onDone }: { onDone: () => void }) {
  const reducedMotion = useReducedMotion();
  const [step, setStep] = useState<Step>("silence");
  const [originIndex, setOriginIndex] = useState(0);

  useEffect(() => {
    if (step !== "silence") return;
    const t = window.setTimeout(() => setStep("intro"), pace(3200, reducedMotion));
    return () => window.clearTimeout(t);
  }, [step, reducedMotion]);

  useEffect(() => {
    if (step !== "origin") return;
    if (originIndex >= dataOriginSteps.length - 1) {
      const t = window.setTimeout(
        () => setStep("transition"),
        pace(2400, reducedMotion)
      );
      return () => window.clearTimeout(t);
    }
    const t = window.setTimeout(
      () => setOriginIndex((i) => i + 1),
      tick(1300, reducedMotion)
    );
    return () => window.clearTimeout(t);
  }, [step, originIndex, reducedMotion]);

  const origin = dataOriginSteps[originIndex];

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 bg-black px-8 text-center text-neutral-200">
      {step === "silence" ? (
        <p className="font-mono text-sm text-neutral-600">...</p>
      ) : null}

      {step === "intro" ? (
        <NarratorText
          lines={confessionIntro}
          onDone={() => setStep("narrator")}
          lineClassName="whitespace-pre-line text-[17px] leading-relaxed"
        />
      ) : null}

      {step === "narrator" ? (
        <NarratorText
          lines={confessionNarrator}
          onDone={() => setStep("origin")}
          lineClassName="whitespace-pre-line text-[16px] leading-relaxed"
        />
      ) : null}

      {step === "origin" ? (
        <div className="flex w-full max-w-xs flex-col gap-3 font-mono text-sm">
          <p className="text-xs tracking-[0.3em] text-neutral-500">
            ORIGEM DE DADOS
          </p>
          <OriginRow label="Narrador" value={origin.narrator} />
          <OriginRow label={projectConfig.playerOneName} value={origin.lucas} />
        </div>
      ) : null}

      {step === "transition" ? (
        <NarratorText
          lines={transitionToFirstPerson}
          onDone={() => setStep("declaration")}
          lineClassName="whitespace-pre-line text-[17px] leading-relaxed"
        />
      ) : null}

      {step === "declaration" ? (
        <motion.div
          initial={reducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="w-full max-w-xs"
        >
          <NarratorText
            lines={declaration}
            onDone={onDone}
            className="flex flex-col gap-4"
            lineClassName="whitespace-pre-line text-[17px] leading-relaxed text-neutral-100"
          />
        </motion.div>
      ) : null}
    </div>
  );
}

function OriginRow({ label, value }: { label: string; value: number }) {
  const reducedMotion = useReducedMotion();
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-neutral-400">{label}</span>
      <motion.span
        key={value}
        initial={reducedMotion ? false : { opacity: 0.4 }}
        animate={{ opacity: 1 }}
        className="tabular-nums text-neutral-100"
      >
        {value}%
      </motion.span>
    </div>
  );
}
