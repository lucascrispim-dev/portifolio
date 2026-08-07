"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AchievementCard } from "@/components/game/AchievementCard";
import { ChoiceButton } from "@/components/game/ChoiceButton";
import { NarratorText } from "@/components/game/NarratorText";
import { useEraTheme } from "@/components/game/EraThemeProvider";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { projectConfig } from "@/config/project";
import {
  ERA_XIII_SECRET_TAP,
  eraCatalog,
  eraThirteenCard,
  eraThirteenSecretAchievement,
  eraThirteenSecretResponse,
  eraThirteenTapResponses,
  lockedEraMessage,
} from "@/content/era-catalog";
import type { EraId, EraStatus, NarratorLine } from "@/types/game";

/**
 * O mapa sustenta a ficção inteira: 13 Eras, as quatro últimas ocultas em
 * "???" e a XIII classificada e pulsando. É para ele acreditar que existe
 * um final guardado para outro dia.
 */
export function ProgressMap({
  eraStatuses,
  eraXiiiTapCount,
  onEraXiiiTap,
  onAchievement,
  onContinue,
  cta,
}: {
  eraStatuses: Record<EraId, EraStatus>;
  eraXiiiTapCount: number;
  onEraXiiiTap: () => void;
  onAchievement: (id: string) => void;
  onContinue: () => void;
  cta: string;
}) {
  const theme = useEraTheme();
  const reducedMotion = useReducedMotion();
  const [lockedMessage, setLockedMessage] = useState<string | null>(null);
  const [xiiiLines, setXiiiLines] = useState<NarratorLine[] | null>(null);
  const [secretFound, setSecretFound] = useState(false);

  function handleLockedTap(label: string) {
    setXiiiLines(null);
    setSecretFound(false);
    setLockedMessage(lockedEraMessage(label));
  }

  function handleEraXiiiTap() {
    setLockedMessage(null);
    const attempt = eraXiiiTapCount + 1;

    if (attempt === ERA_XIII_SECRET_TAP) {
      setXiiiLines(eraThirteenSecretResponse);
      setSecretFound(true);
    } else {
      const index = Math.min(attempt - 1, eraThirteenTapResponses.length - 1);
      setXiiiLines(eraThirteenTapResponses[index]);
      setSecretFound(false);
    }

    onEraXiiiTap();
  }

  const regular = eraCatalog.filter((entry) => entry.id !== 13);

  return (
    <div className="flex flex-1 flex-col gap-6 py-2">
      <div className="flex flex-col gap-1">
        <p className="font-mono text-xs tracking-[0.25em] opacity-70">
          {projectConfig.projectName}
        </p>
      </div>

      <ul className="flex flex-col">
        {regular.map((entry, index) => {
          const status = eraStatuses[entry.id];
          const done = status === "completed";
          const current = status === "active" || status === "available";

          return (
            <motion.li
              key={entry.id}
              initial={reducedMotion ? false : { opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: reducedMotion ? 0 : index * 0.04 }}
            >
              <button
                type="button"
                disabled={entry.playable}
                onClick={
                  entry.playable ? undefined : () => handleLockedTap(entry.label)
                }
                aria-label={`Era ${entry.label} — ${entry.title}`}
                className="flex min-h-11 w-full items-center gap-3 py-1 text-left font-mono text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-default"
                style={{ opacity: done ? 0.85 : current ? 1 : 0.42 }}
              >
                <span className="tabular-nums opacity-70">{entry.label}</span>
                <span className="flex-1 truncate">{entry.title}</span>
                <span
                  aria-hidden
                  className="text-xs tracking-widest"
                  style={{ color: theme.accent }}
                >
                  {done ? "///" : current ? "//" : ""}
                </span>
              </button>
            </motion.li>
          );
        })}
      </ul>

      {/* A Era XIII pulsa discretamente: é a isca da experiência inteira. */}
      <motion.button
        type="button"
        onClick={handleEraXiiiTap}
        aria-label="Era 13 — THE NEXT CHAPTER (classificado)"
        initial={reducedMotion ? false : { opacity: 0, y: 6 }}
        animate={
          reducedMotion
            ? { opacity: 1, y: 0 }
            : { opacity: [0.75, 1, 0.75], y: 0 }
        }
        transition={
          reducedMotion
            ? { duration: 0.3 }
            : { opacity: { duration: 3.2, repeat: Infinity }, y: { duration: 0.4 } }
        }
        className="flex flex-col gap-2 border p-4 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        style={{
          borderRadius: theme.radius,
          borderColor: `${theme.accent}80`,
          backgroundColor: `${theme.foreground}12`,
        }}
      >
        <span
          className="font-mono text-xs tracking-[0.3em]"
          style={{ color: theme.accent }}
        >
          {eraThirteenCard.eraLabel}
        </span>
        <span
          className="text-2xl"
          style={{ fontFamily: theme.titleFontFamily, color: theme.foreground }}
        >
          {eraThirteenCard.title}
        </span>
        <span className="font-mono text-[11px] tracking-[0.2em] opacity-60">
          STATUS: {eraThirteenCard.status}
        </span>
      </motion.button>

      <div className="mt-auto pt-2">
        <ChoiceButton onClick={onContinue}>{cta}</ChoiceButton>
      </div>

      {/*
        A lista é mais alta que a tela do celular, então a resposta fica
        fixa na viewport: renderizada no fluxo, apareceria fora de vista e
        o toque pareceria não ter feito nada.
      */}
      {lockedMessage || xiiiLines ? (
        <div className="pointer-events-none fixed inset-x-0 bottom-6 z-40 flex justify-center px-6">
          <div
            aria-live="polite"
            className="max-w-xs rounded px-4 py-3 text-center"
            style={{
              backgroundColor: `${theme.background}f2`,
              border: `1px solid ${theme.accent}66`,
            }}
          >
            {lockedMessage ? (
              <p
                className="whitespace-pre-line font-mono text-xs leading-relaxed"
                style={{ color: theme.accent }}
              >
                {lockedMessage}
              </p>
            ) : null}
            {xiiiLines ? (
              <NarratorText
                key={`xiii-${eraXiiiTapCount}`}
                lines={xiiiLines}
                className="flex flex-col gap-2"
                lineClassName="whitespace-pre-line text-[14px] leading-relaxed"
              />
            ) : null}
            {secretFound ? (
              <div className="pt-3">
                <AchievementCard
                  achievement={eraThirteenSecretAchievement}
                  onUnlock={onAchievement}
                />
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
