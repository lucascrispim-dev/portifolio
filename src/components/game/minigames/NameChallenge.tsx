"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChoiceButton } from "@/components/game/ChoiceButton";
import { NarratorText } from "@/components/game/NarratorText";
import { useEraTheme } from "@/components/game/EraThemeProvider";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { projectConfig } from "@/config/project";
import { playEffect } from "@/lib/audio";

type Phase = "asking" | "rejecting" | "corrected" | "contested";

/**
 * A piada que define o narrador: ele pergunta o nome, recusa a resposta
 * verdadeira e "corrige" para Cacau Nazaret. Contestar não adianta —
 * é a primeira demonstração de que o sistema não está do lado dele.
 */
export function NameChallenge({
  onAnswer,
  onDone,
}: {
  onAnswer: (text: string) => void;
  onDone: () => void;
}) {
  const theme = useEraTheme();
  const reducedMotion = useReducedMotion();
  const [value, setValue] = useState("");
  const [phase, setPhase] = useState<Phase>("asking");

  function submit() {
    const text = value.trim();
    if (!text) return;
    playEffect("tap");
    onAnswer(text);
    setPhase("rejecting");
    window.setTimeout(
      () => setPhase("corrected"),
      reducedMotion ? 100 : 1800
    );
  }

  return (
    <div className="flex flex-1 flex-col justify-center gap-6">
      <NarratorText
        lines={[
          { text: "Vamos começar\ncom algo simples.", pause: "short" },
          { text: "Qual é seu nome?" },
        ]}
      />

      {phase === "asking" ? (
        <div className="flex flex-col gap-4">
          <label htmlFor="player-name" className="sr-only">
            Seu nome
          </label>
          <input
            id="player-name"
            type="text"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") submit();
            }}
            maxLength={40}
            autoComplete="off"
            className="min-h-11 w-full border-b-2 bg-transparent px-1 py-2 text-[17px] outline-none focus-visible:outline-none"
            style={{ borderColor: theme.accent, color: theme.foreground }}
          />
          <ChoiceButton onClick={submit} disabled={!value.trim()}>
            ENVIAR
          </ChoiceButton>
        </div>
      ) : null}

      {phase === "rejecting" ? (
        <motion.p
          initial={reducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-mono text-sm tracking-[0.2em] text-red-400"
        >
          RESPOSTA INCORRETA
        </motion.p>
      ) : null}

      {phase === "corrected" || phase === "contested" ? (
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <p className="font-mono text-[10px] tracking-[0.25em] opacity-60">
              CORREÇÃO AUTOMÁTICA
            </p>
            <motion.p
              initial={reducedMotion ? false : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl"
              style={{ fontFamily: theme.titleFontFamily, color: theme.accent }}
            >
              {projectConfig.playerTwoJokeName}
            </motion.p>
          </div>

          {phase === "corrected" ? (
            <div className="flex flex-col gap-3">
              <ChoiceButton variant="secondary" onClick={() => setPhase("contested")}>
                CONTESTAR
              </ChoiceButton>
              <ChoiceButton onClick={onDone}>CONTINUAR</ChoiceButton>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <p className="font-mono text-sm tracking-[0.2em] text-red-400">
                RECURSO NEGADO
              </p>
              <ChoiceButton onClick={onDone}>CONTINUAR</ChoiceButton>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
