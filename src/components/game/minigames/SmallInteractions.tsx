"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AchievementCard } from "@/components/game/AchievementCard";
import { ChoiceButton } from "@/components/game/ChoiceButton";
import { NarratorText } from "@/components/game/NarratorText";
import { ConfettiExplosion } from "@/components/game/ConfettiExplosion";
import { useEraTheme } from "@/components/game/EraThemeProvider";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { playEffect } from "@/lib/audio";
import type { Achievement } from "@/types/game";

const FEARLESSLY_CURIOUS: Achievement = {
  id: "fearlessly-curious",
  title: "FEARLESSLY CURIOUS",
};

/** Era II — o botão "NÃO TOQUE" que obviamente será tocado. */
export function NoTouchButton({
  onDone,
  onAchievement,
}: {
  onDone: () => void;
  onAchievement: (id: string) => void;
}) {
  const theme = useEraTheme();
  const [touched, setTouched] = useState(false);

  function handleTouch() {
    if (touched) return;
    playEffect("confirm");
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(20);
      } catch {
        // dispositivo sem suporte — ignorado
      }
    }
    setTouched(true);
  }

  return (
    <div className="relative flex flex-1 flex-col items-center justify-center gap-6">
      {!touched ? (
        <button
          type="button"
          onClick={handleTouch}
          className="min-h-11 px-6 py-3 font-mono text-sm tracking-[0.2em] focus-visible:outline focus-visible:outline-2"
          style={{
            borderRadius: theme.radius,
            border: `1px dashed ${theme.accent}`,
            color: theme.accent,
          }}
        >
          NÃO TOQUE
        </button>
      ) : (
        <div className="relative flex w-full flex-col items-center gap-5">
          <ConfettiExplosion originXPercent={50} originYPercent={10} />
          <NarratorText
            lines={[{ text: "Você realmente\nnão aprende.", pause: "long" }]}
          />
          <AchievementCard
            achievement={FEARLESSLY_CURIOUS}
            onUnlock={onAchievement}
          />
          <ChoiceButton onClick={onDone}>CONTINUAR</ChoiceButton>
        </div>
      )}
    </div>
  );
}

/** Era VII — botão que sopra vento pela tela. */
export function CruelSummer({ onDone }: { onDone: () => void }) {
  const theme = useEraTheme();
  const reducedMotion = useReducedMotion();
  const [refreshed, setRefreshed] = useState(false);

  return (
    <div className="relative flex flex-1 flex-col items-center justify-center gap-6 overflow-hidden">
      {!refreshed ? (
        <ChoiceButton
          onClick={() => {
            playEffect("tap");
            setRefreshed(true);
          }}
        >
          CLIQUE PARA REFRESCAR
        </ChoiceButton>
      ) : (
        <>
          {!reducedMotion
            ? Array.from({ length: 14 }, (_, index) => (
                <motion.span
                  key={index}
                  aria-hidden
                  className="pointer-events-none absolute h-px"
                  style={{
                    top: `${8 + index * 6}%`,
                    width: "40%",
                    backgroundColor: theme.accent,
                    opacity: 0.5,
                  }}
                  initial={{ x: "-60%" }}
                  animate={{ x: "160%" }}
                  transition={{
                    duration: 1.4 + (index % 4) * 0.25,
                    delay: index * 0.06,
                    ease: "easeOut",
                  }}
                />
              ))
            : null}
          <NarratorText
            lines={[
              { text: "Verão cruel\ntemporariamente cancelado.", pause: "short" },
              { text: "Temperatura emocional\npermanece elevada.", pause: "long" },
            ]}
          />
          <ChoiceButton onClick={onDone}>CONTINUAR</ChoiceButton>
        </>
      )}
    </div>
  );
}
