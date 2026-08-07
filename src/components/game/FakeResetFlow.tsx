"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AchievementCard } from "@/components/game/AchievementCard";
import { ChoiceButton } from "@/components/game/ChoiceButton";
import { ConfettiExplosion } from "@/components/game/ConfettiExplosion";
import { NarratorText } from "@/components/game/NarratorText";
import { SystemMessage } from "@/components/game/SystemMessage";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { projectConfig } from "@/config/project";
import { playEffect } from "@/lib/audio";
import type { Achievement } from "@/types/game";

const BAD_IDEA: Achievement = { id: "bad-idea-right", title: "BAD IDEA RIGHT?" };

type Step =
  | "boot"
  | "title"
  | "pressStart"
  | "invite"
  | "clickedNo"
  | "reveal"
  | "restoring"
  | "done";

/**
 * O falso reset. A introdução volta idêntica e ele acredita que perdeu
 * tudo — mas desta vez o botão "Não" fica parado e ele finalmente
 * consegue clicar. A recompensa por conseguir é descobrir que nunca
 * houve perda nenhuma.
 *
 * Nada aqui toca no progresso real: só o `fakeResetStage` avança.
 */
export function FakeResetFlow({
  onFinished,
  onAchievement,
}: {
  onFinished: () => void;
  onAchievement: (id: string) => void;
}) {
  const reducedMotion = useReducedMotion();
  const [step, setStep] = useState<Step>("boot");
  const [restorePercent, setRestorePercent] = useState(0);

  useEffect(() => {
    if (step !== "restoring") return;
    if (restorePercent >= 100) {
      const t = window.setTimeout(() => setStep("done"), reducedMotion ? 100 : 1200);
      return () => window.clearTimeout(t);
    }
    const t = window.setTimeout(
      () => setRestorePercent((p) => Math.min(100, p + 20)),
      reducedMotion ? 20 : 180
    );
    return () => window.clearTimeout(t);
  }, [step, restorePercent, reducedMotion]);

  useEffect(() => {
    if (step !== "clickedNo") return;
    const t = window.setTimeout(() => setStep("reveal"), reducedMotion ? 200 : 2600);
    return () => window.clearTimeout(t);
  }, [step, reducedMotion]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 bg-black px-8 text-center text-neutral-200">
      {step === "boot" ? (
        <SystemMessage
          text={"Inicializando...\n\nConexão estabelecida.\n\nProjeto localizado."}
          className="whitespace-pre-line font-mono text-sm text-neutral-500"
          onDone={() => setStep("title")}
        />
      ) : null}

      {step === "title" ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          onAnimationComplete={() =>
            window.setTimeout(() => setStep("pressStart"), reducedMotion ? 100 : 900)
          }
          className="font-mono text-xl tracking-[0.15em] text-neutral-100"
        >
          {projectConfig.projectName}
        </motion.p>
      ) : null}

      {step === "pressStart" ? (
        <div className="w-full max-w-xs">
          <ChoiceButton onClick={() => setStep("invite")}>PRESS START</ChoiceButton>
        </div>
      ) : null}

      {step === "invite" ? (
        <div className="flex w-full max-w-xs flex-col gap-6">
          <p className="text-[17px] leading-relaxed">
            Você aceita jogar
            <br />
            sem saber qual é o prêmio?
          </p>
          <div className="flex flex-col gap-3">
            <ChoiceButton onClick={() => setStep("clickedNo")}>Sim.</ChoiceButton>
            <ChoiceButton variant="secondary" onClick={() => setStep("clickedNo")}>
              Sim também.
            </ChoiceButton>
            {/*
              Desta vez o "Não" fica parado. Deixá-lo clicável é o ponto
              todo da piada: ele "vence" justamente quando não importa.
            */}
            <ChoiceButton
              variant="secondary"
              onClick={() => {
                playEffect("confirm");
                setStep("clickedNo");
              }}
            >
              Não.
            </ChoiceButton>
          </div>
        </div>
      ) : null}

      {step === "clickedNo" ? (
        <NarratorText
          lines={[
            { text: "...", pause: "short" },
            { text: "Interessante.", pause: "short" },
            { text: "Dessa vez você conseguiu.", pause: "long" },
            { text: "Mas não importa.", pause: "long" },
          ]}
          lineClassName="whitespace-pre-line text-[16px] leading-relaxed"
        />
      ) : null}

      {step === "reveal" ? (
        <div className="relative flex w-full max-w-xs flex-col items-center gap-5">
          <ConfettiExplosion originXPercent={50} originYPercent={8} />
          <NarratorText
            lines={[
              {
                text: "VOCÊ REALMENTE ACHOU\nQUE EU TINHA APAGADO TUDO?",
                pause: "long",
              },
              { text: `${projectConfig.playerTwoJokeName}...`, pause: "short" },
              { text: "Eu faria isso com você?", pause: "long" },
              { text: "Sim.", pause: "short" },
              { text: "Mas não hoje.", pause: "long" },
            ]}
            onDone={() => setStep("restoring")}
            lineClassName="whitespace-pre-line text-[16px] leading-relaxed"
          />
        </div>
      ) : null}

      {step === "restoring" ? (
        <div className="flex flex-col items-center gap-3 font-mono text-sm">
          <p className="tracking-[0.2em] text-neutral-400">RESTAURANDO PROGRESSO</p>
          <p className="text-3xl tabular-nums text-neutral-50">{restorePercent}%</p>
        </div>
      ) : null}

      {step === "done" ? (
        <div className="flex w-full max-w-xs flex-col items-center gap-5">
          <AchievementCard achievement={BAD_IDEA} onUnlock={onAchievement} />
          <p className="text-[15px] opacity-85">Foi uma bad idea, right?</p>
          <ChoiceButton onClick={onFinished}>CONTINUAR</ChoiceButton>
        </div>
      ) : null}
    </div>
  );
}
