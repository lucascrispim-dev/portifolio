"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { AchievementCard } from "@/components/game/AchievementCard";
import { ChoiceButton } from "@/components/game/ChoiceButton";
import { NarratorText } from "@/components/game/NarratorText";
import { useEraTheme } from "@/components/game/EraThemeProvider";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { playEffect } from "@/lib/audio";
import type { Achievement } from "@/types/game";

const PEACE: Achievement = { id: "peace", title: "PEACE" };

/** Treze segundos. Como todo número deste jogo. */
const HOLD_SECONDS = 13;

/**
 * O TESTE DE IMOBILIDADE — Era VIII.
 *
 * folklore é a Era silenciosa, e este é o único minijogo do projeto em
 * que a mecânica é **não fazer nada**. O jogador encosta o dedo e
 * segura por treze segundos enquanto o sistema, pela primeira vez, não
 * provoca, não mente e não interrompe.
 *
 * O jogo passou trinta minutos exigindo reação. Aqui ele exige o
 * contrário, e é isso que faz a Era VIII parecer o fim de alguma coisa
 * — exatamente a impressão de que a virada seguinte precisa.
 *
 * Soltar antes não pune: o contador volta ao início e o sistema espera
 * de novo. Não existe caminho em que ele não passe.
 */
export function StillnessTest({
  onDone,
  onAchievement,
  onCollect,
}: {
  onDone: () => void;
  onAchievement: (id: string) => void;
  onCollect: (itemId: string) => void;
}) {
  const theme = useEraTheme();
  const reducedMotion = useReducedMotion();
  const [holding, setHolding] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [complete, setComplete] = useState(false);
  const [releases, setReleases] = useState(0);
  const [afterDone, setAfterDone] = useState(false);
  const completedRef = useRef(false);

  useEffect(() => {
    if (!holding || complete) return;
    const interval = window.setInterval(() => {
      setElapsed((current) => current + 0.1);
    }, 100);
    return () => window.clearInterval(interval);
  }, [holding, complete]);

  useEffect(() => {
    if (complete || elapsed < HOLD_SECONDS) return;
    if (completedRef.current) return;
    completedRef.current = true;
    playEffect("badge");
    onCollect("fio-invisivel");
    setComplete(true);
    setHolding(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elapsed, complete]);

  function press() {
    if (complete) return;
    setHolding(true);
  }

  function release() {
    if (complete || !holding) return;
    setHolding(false);
    if (elapsed > 1) setReleases((count) => count + 1);
    setElapsed(0);
  }

  const remaining = Math.max(0, HOLD_SECONDS - elapsed);
  const ratio = Math.min(1, elapsed / HOLD_SECONDS);

  if (complete) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
        <NarratorText
          lines={[
            { text: "Pronto.", pause: "long" },
            { text: "Não aconteceu nada.", pause: "long" },
            {
              text: "Era exatamente\nisso que tinha\nque acontecer.",
              pause: "long",
            },
          ]}
          onDone={() => setAfterDone(true)}
          className="flex flex-col gap-3"
          lineClassName="max-w-xs whitespace-pre-line text-[16px] leading-relaxed"
        />
        {afterDone ? (
          <>
            <AchievementCard achievement={PEACE} onUnlock={onAchievement} />
            <div className="w-full max-w-xs">
              <ChoiceButton onClick={onDone}>CONTINUAR</ChoiceButton>
            </div>
          </>
        ) : null}
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-7 text-center">
      <p className="font-mono text-[10px] tracking-[0.28em] opacity-60">
        TESTE DE IMOBILIDADE
      </p>

      <p className="max-w-xs whitespace-pre-line text-[16px] leading-relaxed opacity-85">
        {releases === 0
          ? "Encoste o dedo aqui\ne não faça mais nada."
          : releases === 1
            ? "Você soltou.\nSem problema.\nDe novo."
            : "Você soltou de novo.\nEu tenho o tempo\nque for preciso."}
      </p>

      <button
        type="button"
        onPointerDown={press}
        onPointerUp={release}
        onPointerLeave={release}
        onPointerCancel={release}
        aria-label="Segurar"
        className="relative flex h-44 w-44 items-center justify-center rounded-full border focus-visible:outline focus-visible:outline-2"
        style={{
          borderColor: `${theme.accent}66`,
          backgroundColor: holding ? `${theme.foreground}14` : "transparent",
          touchAction: "none",
        }}
      >
        <motion.span
          aria-hidden
          className="absolute inset-2 rounded-full border"
          style={{ borderColor: theme.accent }}
          animate={{ opacity: 0.15 + ratio * 0.7, scale: 0.86 + ratio * 0.14 }}
          transition={{ duration: reducedMotion ? 0 : 0.25 }}
        />
        <span
          className="relative font-mono text-4xl tabular-nums"
          style={{ color: theme.foreground }}
        >
          {remaining.toFixed(0)}
        </span>
      </button>

      <p className="font-mono text-[10px] tracking-[0.2em] opacity-40">
        {holding ? "MEDINDO O SILÊNCIO" : "AGUARDANDO"}
      </p>
    </div>
  );
}
