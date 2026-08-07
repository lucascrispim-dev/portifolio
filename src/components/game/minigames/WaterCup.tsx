"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AchievementCard } from "@/components/game/AchievementCard";
import { ChoiceButton } from "@/components/game/ChoiceButton";
import { NarratorText } from "@/components/game/NarratorText";
import { SystemBlock } from "@/components/game/SystemBlock";
import { useEraTheme } from "@/components/game/EraThemeProvider";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { playEffect } from "@/lib/audio";
import type { Achievement } from "@/types/game";

const TAPS_REQUIRED = 13;

const CLEAN: Achievement = {
  id: "clean",
  title: "CLEAN",
  description: "Hidratação restaurada.",
};

/** Modo mijão: o copo enche a cada toque até a hidratação ser "concluída". */
export function WaterCup({
  onDone,
  onAchievement,
}: {
  onDone: () => void;
  onAchievement: (id: string) => void;
}) {
  const theme = useEraTheme();
  const reducedMotion = useReducedMotion();
  const [taps, setTaps] = useState(0);

  const full = taps >= TAPS_REQUIRED;
  const level = Math.min(100, Math.round((taps / TAPS_REQUIRED) * 100));

  function addWater() {
    if (full) return;
    playEffect("tap");
    setTaps((t) => t + 1);
  }

  return (
    <div className="flex flex-1 flex-col justify-center gap-6">
      <SystemBlock
        lines={[
          "AVISO DO SISTEMA",
          "Nível de hidratação: desconhecido.",
          "Status do usuário: MIJÃO.",
        ]}
      />

      <p className="text-[15px] opacity-90">Não fique ofendido. Beba água.</p>

      <div className="flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={addWater}
          disabled={full}
          aria-label={full ? "Copo cheio" : "Adicionar água"}
          className="relative h-40 w-24 overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 disabled:cursor-default"
          style={{
            border: `2px solid ${theme.foreground}`,
            borderTopWidth: 0,
            borderRadius: `4px 4px ${theme.radius}px ${theme.radius}px`,
          }}
        >
          <motion.span
            className="absolute inset-x-0 bottom-0 block"
            style={{ backgroundColor: theme.accent }}
            animate={{ height: `${level}%` }}
            transition={{ duration: reducedMotion ? 0 : 0.25 }}
          />
        </button>
        <p className="font-mono text-xs tracking-widest opacity-70">
          {full ? "COPO CHEIO" : "ÁGUA ADICIONADA"}
        </p>
      </div>

      {full ? (
        <div className="flex flex-col gap-5">
          <NarratorText
            lines={[
              { text: "Hidratação concluída.", pause: "short" },
              { text: "Mijão estabilizado.", pause: "long" },
            ]}
          />
          <AchievementCard achievement={CLEAN} onUnlock={onAchievement} />
          <ChoiceButton onClick={onDone}>CONTINUAR</ChoiceButton>
        </div>
      ) : null}
    </div>
  );
}
