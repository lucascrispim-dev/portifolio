"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChoiceButton } from "@/components/game/ChoiceButton";
import { NarratorText } from "@/components/game/NarratorText";
import { SystemBlock } from "@/components/game/SystemBlock";
import { useEraTheme } from "@/components/game/EraThemeProvider";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { projectConfig } from "@/config/project";
import { playEffect } from "@/lib/audio";

type Phase = "handOver" | "lucasChoosing" | "handBack" | "result";

/**
 * A primeira quebra da quarta parede: o celular muda de mãos. Lucas
 * escolhe A, B ou C sem que Cauã veja — e o resultado é CLASSIFICADO,
 * então a escolha não muda absolutamente nada. É só para ele passar o
 * resto do jogo achando que alguma coisa ficou registrada.
 */
export function HandToLucas({
  onChoice,
  onDone,
}: {
  onChoice: (choice: string) => void;
  onDone: () => void;
}) {
  const theme = useEraTheme();
  const reducedMotion = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("handOver");

  function choose(option: string) {
    playEffect("tap");
    onChoice(option);
    setPhase("handBack");
  }

  return (
    <div className="flex flex-1 flex-col justify-center gap-6">
      {phase === "handOver" ? (
        <div className="flex flex-col gap-6">
          <SystemBlock lines={["NOVA TAREFA"]} />
          <NarratorText
            lines={[
              {
                text: `Entregue o celular\npara ${projectConfig.playerOneName}.`,
                pause: "long",
              },
            ]}
          />
          <ChoiceButton onClick={() => setPhase("lucasChoosing")}>
            ENTREGUEI
          </ChoiceButton>
        </div>
      ) : null}

      {phase === "lucasChoosing" ? (
        <motion.div
          initial={reducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col gap-6"
        >
          <div className="flex flex-col gap-1">
            <p
              className="font-mono text-xs tracking-[0.3em]"
              style={{ color: theme.accent }}
            >
              {projectConfig.playerOneName.toUpperCase()}
            </p>
            <p className="text-[15px] leading-relaxed">
              Escolha uma opção
              <br />
              sem deixar {projectConfig.playerTwoJokeName} ver.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            {["A", "B", "C"].map((option) => (
              <ChoiceButton
                key={option}
                variant="secondary"
                onClick={() => choose(option)}
              >
                {option}
              </ChoiceButton>
            ))}
          </div>
        </motion.div>
      ) : null}

      {phase === "handBack" ? (
        <div className="flex flex-col gap-6">
          <NarratorText
            lines={[{ text: "Pode devolver o celular.", pause: "long" }]}
          />
          <ChoiceButton onClick={() => setPhase("result")}>
            DEVOLVIDO
          </ChoiceButton>
        </div>
      ) : null}

      {phase === "result" ? (
        <div className="flex flex-col gap-6">
          <NarratorText
            lines={[
              { text: `${projectConfig.playerOneName} respondeu.`, pause: "short" },
              { text: "Resultado:", pause: "long" },
            ]}
          />
          <p
            className="font-mono text-xl tracking-[0.25em]"
            style={{ color: theme.accent }}
          >
            CLASSIFICADO.
          </p>
          <ChoiceButton onClick={onDone}>CONTINUAR</ChoiceButton>
        </div>
      ) : null}
    </div>
  );
}
