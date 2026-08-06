"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { SystemMessage } from "@/components/game/SystemMessage";
import { ProgressBar } from "@/components/game/ProgressBar";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type Step =
  | "encerrando"
  | "transferindo"
  | "destino"
  | "concluida"
  | "silencio"
  | "despedida"
  | "final";

const STEP_ORDER: Step[] = [
  "encerrando",
  "transferindo",
  "destino",
  "concluida",
  "silencio",
  "despedida",
  "final",
];

/**
 * Sequência terminal e irreversível da Era VIII. Depois de "Olha para
 * ele." não existe nenhum botão, opção ou "Continuar" — o jogo termina
 * ali. Nunca adicione interação após este ponto.
 */
export function FinalTransferSequence({
  playerOneName,
  onReachFinal,
}: {
  playerOneName: string;
  onReachFinal?: () => void;
}) {
  const reducedMotion = useReducedMotion();
  const [stepIndex, setStepIndex] = useState(0);
  const step = STEP_ORDER[stepIndex];

  function advance() {
    setStepIndex((i) => Math.min(i + 1, STEP_ORDER.length - 1));
  }

  useEffect(() => {
    if (step === "silencio") {
      const timeout = window.setTimeout(advance, reducedMotion ? 100 : 1400);
      return () => window.clearTimeout(timeout);
    }
    if (step === "final") {
      onReachFinal?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, reducedMotion]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 bg-black px-8 text-center text-neutral-200">
      {step === "encerrando" ? (
        <SystemMessage text="Encerrando narrativa..." onDone={advance} />
      ) : null}

      {step === "transferindo" ? (
        <div className="flex flex-col items-center gap-3">
          <SystemMessage text="Transferindo controle..." />
          <ProgressBar durationMs={1100} onDone={advance} />
        </div>
      ) : null}

      {step === "destino" ? (
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">Destino:</p>
          <motion.p
            initial={reducedMotion ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            onAnimationComplete={advance}
            className="font-serif text-4xl text-neutral-50"
          >
            {playerOneName}
          </motion.p>
        </div>
      ) : null}

      {step === "concluida" ? (
        <SystemMessage text="Transferência concluída." onDone={advance} />
      ) : null}

      {step === "silencio" ? <div aria-hidden className="h-2" /> : null}

      {step === "despedida" ? (
        <div className="flex flex-col items-center gap-3 text-neutral-300">
          <p>Boa sorte, {playerOneName}.</p>
          <p className="max-w-xs">Escreva um capítulo que eu nunca conseguiria.</p>
          <button
            type="button"
            className="mt-2 min-h-11 text-sm text-neutral-500 underline underline-offset-4"
            onClick={advance}
            aria-label="Continuar"
          >
            ...
          </button>
        </div>
      ) : null}

      {step === "final" ? (
        <motion.p
          initial={reducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.6 }}
          className="font-serif text-3xl text-neutral-50"
        >
          Olha para ele.
        </motion.p>
      ) : null}
    </div>
  );
}
