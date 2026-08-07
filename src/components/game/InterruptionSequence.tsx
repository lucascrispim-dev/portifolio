"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { projectConfig } from "@/config/project";
import { COMPATIBILITY_STEPS } from "@/components/game/CompatibilityBar";

type Step =
  | "black"
  | "detecting"
  | "origin"
  | "cannotDelay"
  | "suspending"
  | "xiiiFails"
  | "realization";

const STEP_ORDER: Step[] = [
  "black",
  "detecting",
  "origin",
  "cannotDelay",
  "suspending",
  "xiiiFails",
  "realization",
];

const SUSPEND_LINES = [
  "Suspendendo Era IX...",
  "Suspendendo Era X...",
  "Suspendendo Era XI...",
  "Suspendendo Era XII...",
];

/**
 * A virada do jogo. Tudo aqui roda sozinho: depois de tocar em ENCERRAR
 * o jogador não tem mais nenhuma decisão a tomar — só assiste o sistema
 * perder o controle da própria narrativa.
 */
export function InterruptionSequence({ onDone }: { onDone: () => void }) {
  const reducedMotion = useReducedMotion();
  const [stepIndex, setStepIndex] = useState(0);
  const step = STEP_ORDER[stepIndex];
  const pace = (ms: number) => (reducedMotion ? Math.min(ms, 200) : ms);

  useEffect(() => {
    const durations: Record<Step, number> = {
      black: 2600,
      detecting: 4200,
      origin: 3600,
      cannotDelay: 4200,
      suspending: 5200,
      xiiiFails: 6500,
      realization: 9000,
    };
    const timeout = window.setTimeout(() => {
      if (stepIndex >= STEP_ORDER.length - 1) {
        onDone();
        return;
      }
      setStepIndex((i) => i + 1);
    }, pace(durations[step]));
    return () => window.clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepIndex, step, reducedMotion]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-5 bg-black px-8 text-center font-mono text-sm text-neutral-300">
      {step === "black" ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4 }}
          className="text-neutral-500"
        >
          ...
        </motion.p>
      ) : null}

      {step === "detecting" ? (
        <Fade>
          <p className="text-neutral-100">Espere.</p>
          <p>Um evento não programado foi detectado.</p>
          <p className="text-neutral-500">Verificando origem...</p>
          <StepBar />
        </Fade>
      ) : null}

      {step === "origin" ? (
        <Fade>
          <p className="text-xs tracking-[0.3em] text-neutral-500">
            ORIGEM IDENTIFICADA
          </p>
          <p className="font-serif text-4xl text-neutral-50">
            {projectConfig.playerOneName}
          </p>
        </Fade>
      ) : null}

      {step === "cannotDelay" ? (
        <Fade>
          <p>Isso não deveria acontecer antes da Era XIII.</p>
          <p>
            Mas aparentemente algumas histórias não seguem o planejamento.
          </p>
          <p className="text-neutral-500">Tentando adiar evento...</p>
          <p className="tracking-[0.2em] text-red-400">FALHA</p>
          <p>O evento não pode ser adiado.</p>
        </Fade>
      ) : null}

      {step === "suspending" ? (
        <Fade>
          {SUSPEND_LINES.map((line, index) => (
            <motion.p
              key={line}
              initial={reducedMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: reducedMotion ? 0 : index * 0.85 }}
              className="text-neutral-500"
            >
              {line}
            </motion.p>
          ))}
        </Fade>
      ) : null}

      {step === "xiiiFails" ? (
        <Fade>
          <p className="text-neutral-500">Suspendendo Era XIII...</p>
          <StepBar stopAt={COMPATIBILITY_STEPS.length - 1} />
          <p className="tracking-[0.2em] text-red-400">ERRO</p>
          <p className="text-neutral-100">A Era XIII não pode ser cancelada.</p>
          <p>Porque ela nunca foi uma Era do sistema.</p>
        </Fade>
      ) : null}

      {step === "realization" ? (
        <Fade>
          <p>Acho que entendi.</p>
          <p>A Era XIII não era uma data.</p>
          <p>Não era uma página.</p>
          <p>Nem uma atualização futura.</p>
          <p className="text-neutral-100">Era apenas o próximo capítulo.</p>
          <p className="pt-2 text-neutral-100">E aparentemente ele começa agora.</p>
        </Fade>
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
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center gap-2 leading-relaxed"
    >
      {children}
    </motion.div>
  );
}

/** Barra em múltiplos de 13, igual à da compatibilidade. */
function StepBar({ stopAt }: { stopAt?: number }) {
  const reducedMotion = useReducedMotion();
  const limit = stopAt ?? COMPATIBILITY_STEPS.length - 1;
  const [index, setIndex] = useState(reducedMotion ? limit : 0);

  useEffect(() => {
    if (index >= limit) return;
    const timeout = window.setTimeout(() => setIndex((i) => i + 1), 260);
    return () => window.clearTimeout(timeout);
  }, [index, limit]);

  return (
    <p className="tabular-nums text-neutral-400">{COMPATIBILITY_STEPS[index]}%</p>
  );
}
