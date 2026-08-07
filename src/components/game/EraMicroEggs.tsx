"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useEraTheme } from "@/components/game/EraThemeProvider";
import { useNotify } from "@/components/game/SystemNotifications";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { playEffect } from "@/lib/audio";
import type { PlayableEraId } from "@/types/game";

type EggKind =
  | "lucky13"
  | "archer"
  | "getawayCar"
  | "invisibleString"
  | "bracelet"
  | "license"
  | "shakeItOff";

type EggConfig = {
  kind: EggKind;
  /** Milissegundos até aparecer, contados da entrada na Era. */
  delayMs: number;
  /** Quanto tempo fica na tela. */
  lifetimeMs: number;
  achievementId?: string;
  hitTitle: string;
  hitBody?: string;
  missTitle?: string;
  missBody?: string;
  easterEggId: string;
};

/**
 * Alvos efêmeros que cruzam a tela durante uma Era.
 *
 * São propositalmente fáceis de perder: quem não estiver prestando
 * atenção simplesmente não os vê, e o jogo segue igual. É a camada que
 * faz o jogador olhar para a tela inteira em vez de só para o botão —
 * ele nunca sabe se alguma coisa vai atravessar enquanto ele lê.
 *
 * Agora existe pelo menos um em quase toda Era, e cada um cita uma
 * música diferente. Errar o alvo tem resposta própria, e às vezes a
 * resposta de errar é melhor que a de acertar.
 */
const EGGS_BY_ERA: Partial<Record<PlayableEraId, EggConfig[]>> = {
  1: [
    {
      kind: "bracelet",
      delayMs: 21000,
      lifetimeMs: 5200,
      achievementId: "you-belong-with-me",
      hitTitle: "🏆 YOU BELONG WITH ME",
      hitBody: "Uma pulseira atravessou a tela e você pegou. Isso não estava previsto.",
      missTitle: "PASSOU",
      missBody: "Alguma coisa atravessou a tela agora. Você não viu.",
      easterEggId: "you-belong-with-me",
    },
  ],
  2: [
    {
      kind: "shakeItOff",
      delayMs: 40000,
      lifetimeMs: 3000,
      hitTitle: "SHAKE IT OFF",
      hitBody: "Não era nada. Mas obrigado por conferir.",
      easterEggId: "shake-it-off",
    },
  ],
  4: [
    {
      kind: "lucky13",
      delayMs: 9000,
      lifetimeMs: 4200,
      achievementId: "the-lucky-one",
      hitTitle: "🏆 THE LUCKY ONE",
      hitBody: "Você é The Lucky One.",
      missTitle: "QUASE",
      missBody: "Talvez você não seja The Lucky One.",
      easterEggId: "the-lucky-one",
    },
    {
      // Olivia Rodrigo: a herdeira aparece na Era do álbum de término.
      kind: "license",
      delayMs: 52000,
      lifetimeMs: 4600,
      achievementId: "drivers-license",
      hitTitle: "🏆 DRIVERS LICENSE",
      hitBody: "A Olivia Rodrigo agradece. A Taylor também.",
      missTitle: "HABILITAÇÃO NÃO EMITIDA",
      missBody: "Você deixou passar. Agora vai ter que ir a pé.",
      easterEggId: "drivers-license",
    },
  ],
  7: [
    {
      kind: "archer",
      delayMs: 15000,
      lifetimeMs: 1900,
      achievementId: "the-archer",
      hitTitle: "🏆 THE ARCHER",
      hitBody: "Alvo atingido.",
      missTitle: "WHO COULD EVER LEAVE YOU?",
      missBody: "Mas quem conseguiria acertar isso?",
      easterEggId: "the-archer",
    },
    {
      kind: "getawayCar",
      delayMs: 32000,
      lifetimeMs: 3400,
      hitTitle: "GETAWAY CAR",
      hitBody: "Tarde demais. Ele já tinha ido.",
      easterEggId: "getaway-car",
    },
  ],
  8: [
    {
      kind: "invisibleString",
      delayMs: 11000,
      lifetimeMs: 9000,
      achievementId: "invisible-string",
      hitTitle: "🏆 INVISIBLE STRING",
      hitBody:
        "Algumas conexões parecem existir antes mesmo de serem percebidas.",
      easterEggId: "invisible-string",
    },
  ],
};

export function EraMicroEggs({
  eraId,
  foundEggs,
  onAchievement,
  onEasterEgg,
}: {
  eraId: PlayableEraId;
  foundEggs: string[];
  onAchievement: (id: string) => void;
  onEasterEgg: (id: string) => void;
}) {
  const eggs = EGGS_BY_ERA[eraId];
  if (!eggs) return null;

  return (
    <>
      {eggs.map((egg) => (
        <MicroEgg
          key={`${eraId}-${egg.kind}`}
          config={egg}
          alreadyFound={foundEggs.includes(egg.easterEggId)}
          onAchievement={onAchievement}
          onEasterEgg={onEasterEgg}
        />
      ))}
    </>
  );
}

function MicroEgg({
  config,
  alreadyFound,
  onAchievement,
  onEasterEgg,
}: {
  config: EggConfig;
  alreadyFound: boolean;
  onAchievement: (id: string) => void;
  onEasterEgg: (id: string) => void;
}) {
  const theme = useEraTheme();
  const reducedMotion = useReducedMotion();
  const notify = useNotify();
  const [phase, setPhase] = useState<"waiting" | "visible" | "hit" | "missed">(
    alreadyFound ? "hit" : "waiting"
  );

  useEffect(() => {
    if (phase !== "waiting") return;
    const timeout = window.setTimeout(() => setPhase("visible"), config.delayMs);
    return () => window.clearTimeout(timeout);
  }, [phase, config.delayMs]);

  useEffect(() => {
    if (phase !== "visible") return;
    const timeout = window.setTimeout(() => {
      setPhase("missed");
      if (config.missTitle) {
        notify({ title: config.missTitle, body: config.missBody });
      }
    }, config.lifetimeMs);
    return () => window.clearTimeout(timeout);
    // `notify` é estável (useCallback no provider); listá-lo aqui só
    // reagendaria o alvo a cada render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, config.lifetimeMs, config.missTitle, config.missBody]);

  function handleHit() {
    if (phase !== "visible") return;
    playEffect("confirm");
    setPhase("hit");
    notify({
      title: config.hitTitle,
      body: config.hitBody,
      tone: config.achievementId ? "reward" : "system",
    });
    onEasterEgg(config.easterEggId);
    if (config.achievementId) onAchievement(config.achievementId);
  }

  return (
    <AnimatePresence>
      {phase === "visible" ? (
        <motion.button
          type="button"
          onClick={handleHit}
          aria-label="Elemento oculto"
          className="pointer-events-auto fixed z-40 flex h-12 w-12 items-center justify-center focus-visible:outline focus-visible:outline-2"
          style={{ color: theme.accent }}
          initial={{
            opacity: 0,
            left: config.kind === "getawayCar" ? "-15%" : "12%",
            top: "42%",
          }}
          animate={
            reducedMotion
              ? { opacity: 1, left: "50%", top: "42%" }
              : config.kind === "archer"
                ? { opacity: [0, 1, 1, 0], left: "70%", top: "34%" }
                : config.kind === "shakeItOff"
                  ? { opacity: [0, 1, 1, 0], left: ["12%", "22%", "12%"], top: "50%" }
                  : {
                      opacity: 1,
                      left: "108%",
                      top: config.kind === "invisibleString" ? "58%" : "42%",
                    }
          }
          exit={{ opacity: 0 }}
          transition={{
            duration: reducedMotion ? 0.2 : config.lifetimeMs / 1000,
            ease: "linear",
          }}
        >
          <EggGlyph kind={config.kind} />
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
}

function EggGlyph({ kind }: { kind: EggKind }) {
  if (kind === "lucky13") {
    return <span className="font-mono text-2xl font-bold tabular-nums">13</span>;
  }
  if (kind === "shakeItOff") {
    return <span className="font-mono text-xl font-bold">?</span>;
  }
  if (kind === "archer") {
    return (
      <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="4.5" />
        <circle cx="12" cy="12" r="1" fill="currentColor" />
      </svg>
    );
  }
  if (kind === "getawayCar") {
    return (
      <svg viewBox="0 0 32 20" width="34" height="22" aria-hidden fill="currentColor">
        <path d="M3 13h26l-2-5h-6l-3-4H10L7 8H4z" />
        <circle cx="9" cy="15" r="3" />
        <circle cx="23" cy="15" r="3" />
      </svg>
    );
  }
  if (kind === "bracelet") {
    return (
      <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.6">
        <circle cx="12" cy="12" r="8" strokeDasharray="1.8 2.4" />
      </svg>
    );
  }
  // license
  return (
    <svg viewBox="0 0 32 22" width="32" height="22" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="1.5" y="2" width="29" height="18" rx="2.5" />
      <circle cx="9" cy="9.5" r="3" />
      <path d="M15 7h12M15 11h12M15 15h8" />
    </svg>
  );
}
