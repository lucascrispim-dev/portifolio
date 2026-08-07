"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChoiceButton } from "@/components/game/ChoiceButton";
import { NarratorText } from "@/components/game/NarratorText";
import { SystemBlock } from "@/components/game/SystemBlock";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { projectConfig } from "@/config/project";
import { pace as paceMs, tick } from "@/lib/pacing";
import { eraThirteenAttempt } from "@/content/final-script";
import { COMPATIBILITY_STEPS } from "@/components/game/CompatibilityBar";

type Step =
  | "mapCollapse"
  | "available"
  | "requirement"
  | "preparing"
  | "error"
  | "explain"
  | "transfer";

/**
 * A Era XIII finalmente abre — e falha. É o último golpe: o jogo entrega
 * exatamente o que prometeu a noite inteira, e então admite que a única
 * coisa que importa não cabe numa tela.
 */
export function EraThirteenSequence({ onDone }: { onDone: () => void }) {
  const reducedMotion = useReducedMotion();
  const [step, setStep] = useState<Step>("mapCollapse");
  const [barIndex, setBarIndex] = useState(0);

  const pace = (ms: number) => paceMs(ms, reducedMotion);

  useEffect(() => {
    const auto: Partial<Record<Step, { next: Step; ms: number }>> = {
      mapCollapse: { next: "available", ms: 3200 },
      error: { next: "explain", ms: 2600 },
      transfer: { next: "transfer", ms: 0 },
    };
    const rule = auto[step];
    if (!rule || rule.ms === 0) return;
    const t = window.setTimeout(() => setStep(rule.next), pace(rule.ms));
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, reducedMotion]);

  useEffect(() => {
    if (step !== "preparing") return;
    if (barIndex >= COMPATIBILITY_STEPS.length - 1) {
      const t = window.setTimeout(() => setStep("error"), pace(1600));
      return () => window.clearTimeout(t);
    }
    const t = window.setTimeout(() => setBarIndex((i) => i + 1), tick(300, reducedMotion));
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, barIndex, reducedMotion]);

  useEffect(() => {
    if (step !== "transfer") return;
    const t = window.setTimeout(onDone, pace(5200));
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, reducedMotion]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 bg-black px-8 text-center text-neutral-200">
      {step === "mapCollapse" ? (
        <div className="flex w-full max-w-xs flex-col gap-2 font-mono text-sm">
          {[9, 10, 11, 12].map((era, index) => (
            <motion.p
              key={era}
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 0 }}
              transition={{
                duration: reducedMotion ? 0.1 : 0.7,
                delay: reducedMotion ? 0 : index * 0.35,
              }}
              className="text-neutral-600"
            >
              {era}
            </motion.p>
          ))}
          <motion.p
            initial={{ opacity: 0.6 }}
            animate={{ opacity: 1 }}
            transition={{ duration: reducedMotion ? 0.1 : 1.4, delay: reducedMotion ? 0 : 1.6 }}
            className="pt-2 text-lg tracking-[0.2em] text-neutral-50"
          >
            13
          </motion.p>
        </div>
      ) : null}

      {step === "available" ? (
        <div className="flex w-full max-w-xs flex-col items-center gap-5">
          <SystemBlock lines={["ERA XIII", "THE NEXT ERA", "", "STATUS: DISPONÍVEL"]} />
          <ChoiceButton onClick={() => setStep("requirement")}>
            INICIAR ERA XIII
          </ChoiceButton>
        </div>
      ) : null}

      {step === "requirement" ? (
        <NarratorText
          lines={[
            { text: "Requisito identificado:", pause: "short" },
            { text: "UMA RESPOSTA", pause: "long" },
          ]}
          onDone={() => setStep("preparing")}
          lineClassName="whitespace-pre-line font-mono text-[15px] tracking-[0.15em]"
        />
      ) : null}

      {step === "preparing" ? (
        <div className="flex flex-col items-center gap-3 font-mono text-sm">
          <p className="text-neutral-500">Preparando pergunta...</p>
          <p className="text-3xl tabular-nums text-neutral-100">
            {COMPATIBILITY_STEPS[barIndex]}%
          </p>
        </div>
      ) : null}

      {step === "error" ? (
        <motion.p
          initial={reducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-mono tracking-[0.3em] text-red-400"
        >
          ERRO.
        </motion.p>
      ) : null}

      {step === "explain" ? (
        <NarratorText
          lines={eraThirteenAttempt}
          onDone={() => setStep("transfer")}
          lineClassName="whitespace-pre-line text-[16px] leading-relaxed"
        />
      ) : null}

      {step === "transfer" ? (
        <div className="flex flex-col items-center gap-3 font-mono text-sm">
          <p className="text-xs tracking-[0.3em] text-neutral-500">
            TRANSFERINDO CONTROLE
          </p>
          <p className="text-neutral-300">
            Narrador → {projectConfig.playerOneName}
          </p>
          <motion.p
            initial={reducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: reducedMotion ? 0 : 1.4 }}
            className="pt-2 text-neutral-100"
          >
            Transferência concluída.
          </motion.p>
        </div>
      ) : null}
    </div>
  );
}
