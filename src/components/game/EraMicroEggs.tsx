"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useEraTheme } from "@/components/game/EraThemeProvider";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { playEffect } from "@/lib/audio";
import type { PlayableEraId } from "@/types/game";

type EggKind = "lucky13" | "archer" | "getawayCar" | "invisibleString";

type EggConfig = {
  kind: EggKind;
  /** Segundos até aparecer, contados da entrada na Era. */
  delayMs: number;
  /** Quanto tempo fica na tela. */
  lifetimeMs: number;
  achievementId?: string;
  achievementTitle?: string;
  hitMessage: string;
  missMessage?: string;
  easterEggId: string;
};

/**
 * Alvos efêmeros que cruzam a tela durante uma Era. São propositalmente
 * fáceis de perder: quem não estiver prestando atenção simplesmente não
 * os vê, e o jogo segue igual.
 */
const EGGS_BY_ERA: Partial<Record<PlayableEraId, EggConfig[]>> = {
  4: [
    {
      kind: "lucky13",
      delayMs: 9000,
      lifetimeMs: 4200,
      achievementId: "the-lucky-one",
      achievementTitle: "THE LUCKY ONE",
      hitMessage: "Você é The Lucky One.",
      missMessage: "Quase.\nTalvez você não seja The Lucky One.",
      easterEggId: "the-lucky-one",
    },
  ],
  7: [
    {
      kind: "archer",
      delayMs: 15000,
      lifetimeMs: 1900,
      achievementId: "the-archer",
      achievementTitle: "THE ARCHER",
      hitMessage: "Alvo atingido.",
      missMessage:
        "Who could ever leave you?\nMas quem conseguiria acertar isso?",
      easterEggId: "the-archer",
    },
    {
      kind: "getawayCar",
      delayMs: 32000,
      lifetimeMs: 3400,
      hitMessage: "Tarde demais.\nEra um Getaway Car.",
      easterEggId: "getaway-car",
    },
  ],
  8: [
    {
      kind: "invisibleString",
      delayMs: 11000,
      lifetimeMs: 9000,
      achievementId: "invisible-string",
      achievementTitle: "INVISIBLE STRING",
      hitMessage:
        "Arquivo encontrado: invisible string.\nAlgumas conexões parecem existir\nantes mesmo de serem percebidas.",
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
  onAchievement: (id: string, title: string) => void;
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
  onAchievement: (id: string, title: string) => void;
  onEasterEgg: (id: string) => void;
}) {
  const theme = useEraTheme();
  const reducedMotion = useReducedMotion();
  const [phase, setPhase] = useState<"waiting" | "visible" | "hit" | "missed">(
    alreadyFound ? "hit" : "waiting"
  );
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (phase !== "waiting") return;
    const timeout = window.setTimeout(() => setPhase("visible"), config.delayMs);
    return () => window.clearTimeout(timeout);
  }, [phase, config.delayMs]);

  useEffect(() => {
    if (phase !== "visible") return;
    const timeout = window.setTimeout(() => {
      setPhase("missed");
      if (config.missMessage) setMessage(config.missMessage);
    }, config.lifetimeMs);
    return () => window.clearTimeout(timeout);
  }, [phase, config.lifetimeMs, config.missMessage]);

  useEffect(() => {
    if (!message) return;
    const timeout = window.setTimeout(() => setMessage(null), 5200);
    return () => window.clearTimeout(timeout);
  }, [message]);

  function handleHit() {
    if (phase !== "visible") return;
    playEffect("confirm");
    setPhase("hit");
    setMessage(config.hitMessage);
    onEasterEgg(config.easterEggId);
    if (config.achievementId && config.achievementTitle) {
      onAchievement(config.achievementId, config.achievementTitle);
    }
  }

  return (
    <>
      <AnimatePresence>
        {phase === "visible" ? (
          <motion.button
            type="button"
            onClick={handleHit}
            aria-label="Elemento oculto"
            className="pointer-events-auto fixed z-40 flex h-12 w-12 items-center justify-center focus-visible:outline focus-visible:outline-2"
            style={{ color: theme.accent }}
            initial={{ opacity: 0, left: config.kind === "getawayCar" ? "-15%" : "12%", top: "42%" }}
            animate={
              reducedMotion
                ? { opacity: 1, left: "50%", top: "42%" }
                : config.kind === "archer"
                  ? { opacity: [0, 1, 1, 0], left: "70%", top: "34%" }
                  : { opacity: 1, left: "108%", top: config.kind === "invisibleString" ? "58%" : "42%" }
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

      {message ? (
        <div
          aria-live="polite"
          className="pointer-events-none fixed inset-x-0 bottom-24 z-40 flex justify-center px-6"
        >
          <p
            className="max-w-xs whitespace-pre-line rounded px-4 py-3 text-center font-mono text-xs leading-relaxed"
            style={{
              backgroundColor: `${theme.background}e6`,
              color: theme.accent,
              border: `1px solid ${theme.accent}55`,
            }}
          >
            {message}
          </p>
        </div>
      ) : null}
    </>
  );
}

function EggGlyph({ kind }: { kind: EggKind }) {
  if (kind === "lucky13") {
    return (
      <span className="font-mono text-2xl font-bold tabular-nums">13</span>
    );
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
  return (
    <svg viewBox="0 0 60 12" width="56" height="12" aria-hidden fill="none" stroke="currentColor" strokeWidth="1">
      <path d="M0 6 C15 0, 45 12, 60 6" opacity="0.55" />
    </svg>
  );
}
