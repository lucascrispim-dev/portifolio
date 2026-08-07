"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChoiceButton } from "@/components/game/ChoiceButton";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { playEffect } from "@/lib/audio";

type Step = "saving" | "stuck" | "glitch" | "black" | "failure";

const GLITCH_LINES = [
  "PR0J3CT N3XT 3R@",
  "D@D0S C0RR0MP1D0S",
  "T3NT@ND0 R3CUP3R@R...",
];

/**
 * A grande sabotagem: o jogo finge corromper o progresso depois da
 * Era III. Nada é apagado de verdade — só encoberto (ver
 * `fakeResetStage` em types/game.ts). Isso importa: se o navegador for
 * fechado durante o susto, o progresso continua intacto.
 */
export function Erro13Sequence({ onRestart }: { onRestart: () => void }) {
  const reducedMotion = useReducedMotion();
  const [step, setStep] = useState<Step>("saving");
  const [percent, setPercent] = useState(0);

  // Sobe até 99% e trava — o número que nunca fecha neste projeto.
  useEffect(() => {
    if (step !== "saving") return;
    if (percent >= 99) {
      const timeout = window.setTimeout(
        () => setStep("stuck"),
        reducedMotion ? 100 : 1400
      );
      return () => window.clearTimeout(timeout);
    }
    const next = percent < 90 ? percent + 13 : 99;
    const timeout = window.setTimeout(
      () => setPercent(Math.min(next, 99)),
      reducedMotion ? 20 : 260
    );
    return () => window.clearTimeout(timeout);
  }, [step, percent, reducedMotion]);

  useEffect(() => {
    if (step === "stuck") {
      playEffect("escape");
      const t = window.setTimeout(() => setStep("glitch"), reducedMotion ? 100 : 900);
      return () => window.clearTimeout(t);
    }
    if (step === "glitch") {
      const t = window.setTimeout(() => setStep("black"), reducedMotion ? 150 : 2600);
      return () => window.clearTimeout(t);
    }
    if (step === "black") {
      const t = window.setTimeout(() => setStep("failure"), reducedMotion ? 150 : 1800);
      return () => window.clearTimeout(t);
    }
  }, [step, reducedMotion]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-5 bg-black px-8 text-center font-mono text-sm text-neutral-300">
      {step === "saving" || step === "stuck" ? (
        <>
          <p className="text-neutral-500">Salvando progresso...</p>
          <p className="text-3xl tabular-nums text-neutral-100">{percent}%</p>
        </>
      ) : null}

      {step === "stuck" ? (
        <motion.p
          animate={reducedMotion ? undefined : { opacity: [1, 0.2, 1, 0.4, 1] }}
          transition={{ duration: 0.6, repeat: 2 }}
          className="tracking-[0.3em] text-red-500"
        >
          ERRO 13
        </motion.p>
      ) : null}

      {step === "glitch" ? (
        <div className="flex flex-col gap-2">
          {GLITCH_LINES.map((line, index) => (
            <motion.p
              key={line}
              initial={reducedMotion ? false : { opacity: 0, x: 0 }}
              animate={
                reducedMotion
                  ? { opacity: 1 }
                  : { opacity: [0, 1, 0.6, 1], x: [0, -3, 3, 0] }
              }
              transition={{ duration: 0.5, delay: reducedMotion ? 0 : index * 0.5 }}
              className="tracking-[0.15em] text-red-400"
            >
              {line}
            </motion.p>
          ))}
        </div>
      ) : null}

      {step === "failure" ? (
        <motion.div
          initial={reducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="flex w-full max-w-xs flex-col items-center gap-4"
        >
          <p className="tracking-[0.2em] text-red-400">FALHA CRÍTICA</p>
          <p className="leading-relaxed text-neutral-200">
            Não foi possível
            <br />
            recuperar o progresso.
          </p>
          <p className="leading-relaxed text-neutral-400">
            Reinicialização necessária.
          </p>
          <div className="w-full pt-2">
            <ChoiceButton onClick={onRestart}>REINICIAR</ChoiceButton>
          </div>
        </motion.div>
      ) : null}
    </div>
  );
}
