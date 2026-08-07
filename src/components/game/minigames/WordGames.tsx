"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChoiceButton } from "@/components/game/ChoiceButton";
import { ConfettiExplosion } from "@/components/game/ConfettiExplosion";
import { NarratorText } from "@/components/game/NarratorText";
import { useEraTheme } from "@/components/game/EraThemeProvider";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { playEffect } from "@/lib/audio";

/** Distratores do roteiro — todos piada interna. */
const OUR_SONG_WORDS = [
  "PIZZA",
  "OUR",
  "TAYLOR",
  "SUPRA",
  "AUGUSTA",
  "SONG",
  "MIJÃO",
  "LEITE",
  "TOY STORY",
  "SÃO PAULO",
  "VILLA-LOBOS",
  "CACAU",
];

const OUR_SONG_TARGETS = ["OUR", "SONG"];

/** Era I — achar OUR e SONG no meio das piadas internas. */
export function OurSong({ onDone }: { onDone: () => void }) {
  const theme = useEraTheme();
  const reducedMotion = useReducedMotion();
  const [found, setFound] = useState<string[]>([]);
  const [wrong, setWrong] = useState<string | null>(null);

  const complete = OUR_SONG_TARGETS.every((t) => found.includes(t));

  function tap(word: string) {
    if (complete || found.includes(word)) return;
    if (OUR_SONG_TARGETS.includes(word)) {
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
          Duas palavras pertencem a vocês.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {OUR_SONG_WORDS.map((word) => {
          const isFound = found.includes(word);
          return (
            <motion.button
              key={word}
              type="button"
              onClick={() => tap(word)}
              disabled={isFound}
              animate={
                wrong === word && !reducedMotion
                  ? { x: [0, -4, 4, -2, 2, 0] }
                  : { x: 0 }
              }
              transition={{ duration: 0.3 }}
              className="min-h-11 px-3 py-2 font-mono text-sm focus-visible:outline focus-visible:outline-2"
              style={{
                borderRadius: theme.radius,
                border: `1px solid ${isFound ? theme.accent : `${theme.foreground}40`}`,
                backgroundColor: isFound ? theme.accent : "transparent",
                color: isFound ? theme.accentTextColor : theme.foreground,
              }}
            >
              {word}
            </motion.button>
          );
        })}
      </div>

      {complete ? <TaylorMeter onDone={onDone} /> : null}
    </div>
  );
}

/** A barra que enche até "EXCESSIVA" — nunca houve dúvida do resultado. */
function TaylorMeter({ onDone }: { onDone: () => void }) {
  const theme = useEraTheme();
  const reducedMotion = useReducedMotion();
  const [full, setFull] = useState(reducedMotion);

  return (
    <div className="flex flex-col gap-4">
      <NarratorText
        lines={[
          { text: "Our Song localizada.", pause: "short" },
          {
            text: "Quantidade de Taylor Swift\ndetectada nesta relação:",
            pause: "short",
          },
        ]}
        onDone={() => setFull(true)}
      />

      <div
        className="h-2 w-full overflow-hidden rounded-full"
        style={{ backgroundColor: `${theme.foreground}26` }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: theme.accent }}
          initial={{ width: "0%" }}
          animate={{ width: full ? "100%" : "0%" }}
          transition={{ duration: reducedMotion ? 0 : 1.6, ease: "easeInOut" }}
        />
      </div>

      {full ? (
        <>
          <p
            className="font-mono text-lg tracking-[0.25em]"
            style={{ color: theme.accent }}
          >
            EXCESSIVA
          </p>
          <ChoiceButton onClick={onDone}>CONTINUAR</ChoiceButton>
        </>
      ) : null}
    </div>
  );
}

/** Era II — juntar LOVE e STORY, com um aviso para não se empolgar. */
export function LoveStory({ onDone }: { onDone: () => void }) {
  const theme = useEraTheme();
  const [picked, setPicked] = useState<string[]>([]);
  const [responseDone, setResponseDone] = useState(false);
  const joined = picked.length === 2;

  function pick(word: string) {
    if (picked.includes(word) || joined) return;
    playEffect("tap");
    setPicked((p) => [...p, word]);
  }

  return (
    <div className="relative flex flex-1 flex-col items-center justify-center gap-8">
      {!joined ? (
        <>
          <p className="text-[15px] opacity-85">Duas metades. Junte.</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {["LOVE", "STORY"].map((word) => (
              <button
                key={word}
                type="button"
                onClick={() => pick(word)}
                disabled={picked.includes(word)}
                className="min-h-11 px-5 py-3 font-mono text-lg tracking-[0.2em] focus-visible:outline focus-visible:outline-2"
                style={{
                  borderRadius: theme.radius,
                  border: `1px solid ${theme.foreground}55`,
                  opacity: picked.includes(word) ? 0.35 : 1,
                }}
              >
                {word}
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="flex w-full max-w-xs flex-col items-center gap-5">
          <ConfettiExplosion originXPercent={50} originYPercent={12} />
          <p
            className="font-mono text-2xl tracking-[0.2em]"
            style={{ color: theme.accent }}
          >
            LOVE STORY
          </p>
          <NarratorText
            lines={[
              { text: "Love Story concluída.", pause: "long" },
              { text: "Não se empolgue.", pause: "short" },
              { text: "Estamos apenas\nna Era II.", pause: "long" },
            ]}
            onDone={() => setResponseDone(true)}
          />
          {responseDone ? (
            <ChoiceButton onClick={onDone}>CONTINUAR</ChoiceButton>
          ) : null}
        </div>
      )}
    </div>
  );
}
