"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AchievementCard } from "@/components/game/AchievementCard";
import { ChoiceButton } from "@/components/game/ChoiceButton";
import { NarratorText } from "@/components/game/NarratorText";
import { useEraTheme } from "@/components/game/EraThemeProvider";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { playEffect } from "@/lib/audio";
import type { Achievement } from "@/types/game";

const MIJAO: Achievement = { id: "mijao", title: "MIJÃO" };

/** Cada porta tem sua desculpa. A última cede. */
const DOORS = [
  { name: "BAR", refusal: "FECHADO." },
  { name: "LANCHONETE", refusal: "SÓ PARA CLIENTES." },
  { name: "POSTO", refusal: "FORA DE SERVIÇO." },
  { name: "PADARIA", refusal: "A CHAVE SUMIU." },
  { name: "HAMBURGUERIA", refusal: "SÓ PARA CLIENTES." },
  { name: "24 HORAS", refusal: null },
];

/**
 * Era IV — a peregrinação pela Augusta atrás de um banheiro. Todo lugar
 * recusa até o último. A piada só funciona porque demora.
 */
export function BathroomMaze({
  onDone,
  onAchievement,
  onPatienceDrop,
}: {
  onDone: () => void;
  onAchievement: (id: string) => void;
  onPatienceDrop: () => void;
}) {
  const theme = useEraTheme();
  const reducedMotion = useReducedMotion();
  const [tried, setTried] = useState<string[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [found, setFound] = useState(false);

  function tryDoor(door: (typeof DOORS)[number]) {
    if (found) return;
    if (door.refusal === null) {
      playEffect("confirm");
      setFound(true);
      return;
    }
    playEffect("escape");
    if (tried.length === 1) onPatienceDrop();
    setTried((t) => (t.includes(door.name) ? t : [...t, door.name]));
    setMessage(door.refusal);
  }

  if (found) {
    return (
      <div className="flex flex-1 flex-col justify-center gap-5">
        <p
          className="font-mono text-lg tracking-[0.2em]"
          style={{ color: theme.accent }}
        >
          BANHEIRO ENCONTRADO.
        </p>
        <NarratorText
          lines={[
            { text: "Agora você entende\no sofrimento do Lucas.", pause: "long" },
          ]}
        />
        <AchievementCard achievement={MIJAO} onUnlock={onAchievement} />
        <ChoiceButton onClick={onDone}>CONTINUAR</ChoiceButton>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col justify-center gap-6">
      <div className="flex flex-col gap-1">
        <p className="font-mono text-xs tracking-[0.25em] opacity-70">
          RUA AUGUSTA
        </p>
        <p className="text-[15px] leading-relaxed opacity-90">
          LEVE CACAU
          <br />
          ATÉ UM BANHEIRO.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {DOORS.map((door) => {
          const wasTried = tried.includes(door.name);
          return (
            <motion.button
              key={door.name}
              type="button"
              onClick={() => tryDoor(door)}
              animate={
                wasTried && !reducedMotion ? { opacity: 0.4 } : { opacity: 1 }
              }
              className="min-h-[64px] px-3 py-3 text-center font-mono text-xs tracking-wide focus-visible:outline focus-visible:outline-2"
              style={{
                borderRadius: theme.radius,
                border: `1px solid ${theme.foreground}44`,
              }}
            >
              {door.name}
            </motion.button>
          );
        })}
      </div>

      {message ? (
        <p
          aria-live="polite"
          className="text-center font-mono text-sm tracking-[0.15em]"
          style={{ color: theme.accent }}
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}
