"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { projectConfig } from "@/config/project";
import { COMPATIBILITY_STEPS } from "@/components/game/CompatibilityBar";

type Step =
  | "shuttingDown"
  | "transferring"
  | "permission"
  | "farewell"
  | "final";

const STEP_ORDER: Step[] = [
  "shuttingDown",
  "transferring",
  "permission",
  "farewell",
  "final",
];

/**
 * Sequência terminal e irreversível. Depois de "Olha para ele." não
 * existe botão, contagem ou pergunta — o jogo termina ali e o resto
 * acontece fora da tela. Nunca adicione interação a partir deste ponto.
 */
export function FinalTransferSequence({
  onReachFinal,
}: {
  onReachFinal?: () => void;
}) {
  const reducedMotion = useReducedMotion();
  const [stepIndex, setStepIndex] = useState(0);
  const step = STEP_ORDER[stepIndex];

  useEffect(() => {
    if (step === "final") {
      onReachFinal?.();
      return;
    }
    const durations: Record<Step, number> = {
      shuttingDown: 7000,
      transferring: 5200,
      permission: 4200,
      farewell: 7000,
      final: 0,
    };
    const delay = reducedMotion ? 200 : durations[step];
    const timeout = window.setTimeout(() => setStepIndex((i) => i + 1), delay);
    return () => window.clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, reducedMotion]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 bg-black px-8 text-center font-mono text-sm text-neutral-300">
      {step === "shuttingDown" ? (
        <Fade>
          <p className="text-neutral-500">Encerrando narrativa...</p>
          <p className="text-neutral-500">Desativando previsões...</p>
          <p className="text-neutral-500">Removendo distrações...</p>
          <p className="text-neutral-500">
            Silenciando Taylor Swift por aproximadamente trinta segundos...
          </p>
          <p className="pt-2 text-neutral-100">Isso deve ser importante.</p>
        </Fade>
      ) : null}

      {step === "transferring" ? (
        <Fade>
          <p className="text-xs tracking-[0.3em] text-neutral-500">
            TRANSFERINDO CONTROLE
          </p>
          <p className="text-neutral-500">Destino:</p>
          <p className="font-serif text-4xl text-neutral-50">
            {projectConfig.playerOneName}
          </p>
          <TransferBar />
        </Fade>
      ) : null}

      {step === "permission" ? (
        <Fade>
          <p className="text-neutral-100">Permissão humana necessária.</p>
          <p className="pt-2 text-neutral-400">Controle transferido.</p>
        </Fade>
      ) : null}

      {step === "farewell" ? (
        <Fade>
          <p className="text-neutral-100">
            Boa sorte, {projectConfig.playerOneName}.
          </p>
          <p className="pt-2 text-neutral-100">{projectConfig.playerTwoName}...</p>
          <p className="max-w-xs pt-2 leading-relaxed">
            O próximo capítulo não está dentro deste site.
          </p>
        </Fade>
      ) : null}

      {step === "final" ? (
        <motion.p
          initial={reducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.8 }}
          className="font-serif text-3xl text-neutral-50"
        >
          Olha para ele.
        </motion.p>
      ) : null}
    </div>
  );
}

function Fade({ children }: { children: React.ReactNode }) {
  const reducedMotion = useReducedMotion();
  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
      className="flex flex-col items-center gap-2 leading-relaxed"
    >
      {children}
    </motion.div>
  );
}

/** Sobe em múltiplos de 13 e para em 99%, como todas as barras do jogo. */
function TransferBar() {
  const reducedMotion = useReducedMotion();
  const last = COMPATIBILITY_STEPS.length - 1;
  const [index, setIndex] = useState(reducedMotion ? last : 0);

  useEffect(() => {
    if (index >= last) return;
    const timeout = window.setTimeout(() => setIndex((i) => i + 1), 300);
    return () => window.clearTimeout(timeout);
  }, [index, last]);

  return (
    <p className="pt-1 tabular-nums text-neutral-400">
      {COMPATIBILITY_STEPS[index]}%
    </p>
  );
}
