"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChoiceButton } from "@/components/game/ChoiceButton";
import { NarratorText } from "@/components/game/NarratorText";
import { useEraTheme } from "@/components/game/EraThemeProvider";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { playEffect } from "@/lib/audio";

const TARGETS = ["NOSSA", "MÚSICA"] as const;

/** Distratores do roteiro, embaralhados em ordem fixa (nada de aleatório em render). */
const WORDS = [
  "TAYLOR",
  "NOSSA",
  "PIZZA",
  "IDIOTA",
  "FILME",
  "MÚSICA",
  "CACAU",
  "LEITE",
  "MIJÃO",
  "VILLA-LOBOS",
];

export function WordSearch({ onDone }: { onDone: () => void }) {
  const theme = useEraTheme();
  const reducedMotion = useReducedMotion();
  const [found, setFound] = useState<string[]>([]);
  const [wrong, setWrong] = useState<string | null>(null);

  const complete = TARGETS.every((t) => found.includes(t));

  function handleTap(word: string) {
    if (complete) return;
    if ((TARGETS as readonly string[]).includes(word)) {
      if (found.includes(word)) return;
      playEffect("confirm");
      setWrong(null);
      setFound((f) => [...f, word]);
      return;
    }
    playEffect("escape");
    setWrong(word);
  }

  return (
    <div className="flex flex-1 flex-col justify-center gap-6">
      <div className="flex flex-col gap-1">
        <p className="font-mono text-xs tracking-[0.25em] opacity-70">
          ARQUIVO FRAGMENTADO
        </p>
        <p className="text-[15px] opacity-90">
          Duas palavras pertencem a vocês. Encontre as duas.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {WORDS.map((word) => {
          const isFound = found.includes(word);
          return (
            <motion.button
              key={word}
              type="button"
              onClick={() => handleTap(word)}
              disabled={isFound}
              animate={
                wrong === word && !reducedMotion
                  ? { x: [0, -4, 4, -2, 2, 0] }
                  : { x: 0 }
              }
              transition={{ duration: 0.3 }}
              className="min-h-11 px-3 py-2 font-mono text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{
                borderRadius: theme.radius,
                border: `1px solid ${isFound ? theme.accent : `${theme.foreground}40`}`,
                backgroundColor: isFound ? theme.accent : "transparent",
                color: isFound ? theme.accentTextColor : theme.foreground,
                opacity: isFound ? 1 : 0.9,
              }}
            >
              {word}
            </motion.button>
          );
        })}
      </div>

      {complete ? (
        <div className="flex flex-col gap-5">
          <NarratorText
            lines={[
              { text: "Arquivo localizado:\nOur Song", pause: "short" },
              { text: "Ainda não sei\nqual é a música de vocês.", pause: "short" },
              {
                text: "Mas certamente\nhá Taylor Swift demais\nnesta história.",
                pause: "long",
              },
            ]}
          />
          <ChoiceButton onClick={onDone}>CONTINUAR</ChoiceButton>
        </div>
      ) : (
        <p className="min-h-[1.5em] font-mono text-xs opacity-60">
          {found.length} de {TARGETS.length} localizadas
        </p>
      )}
    </div>
  );
}
