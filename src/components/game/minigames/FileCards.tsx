"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChoiceButton } from "@/components/game/ChoiceButton";
import { NarratorText } from "@/components/game/NarratorText";
import { useEraTheme } from "@/components/game/EraThemeProvider";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { playEffect } from "@/lib/audio";

const BASE_CARDS = [
  "TOY STORY",
  "PIZZA",
  "VILLA-LOBOS",
  "TAYLOR SWIFT",
  "TE AMO, IDIOTA",
  "TOMAR LEITE",
  "CACAU NAZARET",
  "MIJÃO",
  "ALGO PRETINHO",
];

/**
 * Arquivo da Era VIII. Inclui o texto que o jogador digitou na Era V e,
 * por último, o ARQUIVO XIII bloqueado — a última reafirmação de que a
 * história continuaria depois.
 */
export function FileCards({
  blankSpaceAnswer,
  onDone,
}: {
  blankSpaceAnswer: string;
  onDone: () => void;
}) {
  const theme = useEraTheme();
  const reducedMotion = useReducedMotion();
  const [blankRevealed, setBlankRevealed] = useState(false);
  const [lockedMessage, setLockedMessage] = useState(false);

  const cards = blankSpaceAnswer
    ? [...BASE_CARDS, `“${blankSpaceAnswer}”`]
    : BASE_CARDS;

  return (
    <div className="flex flex-1 flex-col justify-center gap-6">
      <p className="font-mono text-xs tracking-[0.25em] opacity-70">
        ARQUIVO DE REFERÊNCIAS
      </p>

      <div className="flex flex-wrap gap-2">
        {cards.map((card, index) => {
          const isBlankAnswer = Boolean(blankSpaceAnswer) && index === cards.length - 1;
          return (
            <motion.button
              key={card}
              type="button"
              onClick={
                isBlankAnswer
                  ? () => {
                      playEffect("tap");
                      setBlankRevealed(true);
                    }
                  : undefined
              }
              disabled={!isBlankAnswer}
              initial={reducedMotion ? false : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: reducedMotion ? 0 : index * 0.06 }}
              className="min-h-11 px-3 py-2 text-left font-mono text-xs tracking-wide focus-visible:outline focus-visible:outline-2 disabled:cursor-default"
              style={{
                borderRadius: theme.radius,
                border: `1px solid ${theme.foreground}33`,
                backgroundColor: `${theme.foreground}0f`,
              }}
            >
              {card}
            </motion.button>
          );
        })}

        <button
          type="button"
          onClick={() => {
            playEffect("escape");
            setLockedMessage(true);
          }}
          className="min-h-11 px-3 py-2 text-left font-mono text-xs tracking-wide focus-visible:outline focus-visible:outline-2"
          style={{
            borderRadius: theme.radius,
            border: `1px dashed ${theme.accent}`,
            color: theme.accent,
          }}
        >
          ARQUIVO XIII
        </button>
      </div>

      {lockedMessage ? (
        <p aria-live="polite" className="font-mono text-xs opacity-75">
          ARQUIVO XIII — ACESSO BLOQUEADO
        </p>
      ) : null}

      {blankRevealed ? (
        <NarratorText
          lines={[
            { text: `Você escreveu:\n“${blankSpaceAnswer}”`, pause: "short" },
            { text: "Continuo sem entender.", pause: "long" },
          ]}
        />
      ) : null}

      <ChoiceButton onClick={onDone}>CONTINUAR</ChoiceButton>
    </div>
  );
}
