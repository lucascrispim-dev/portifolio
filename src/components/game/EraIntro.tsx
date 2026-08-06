"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChoiceButton } from "@/components/game/ChoiceButton";
import { useEraTheme } from "@/components/game/EraThemeProvider";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { EraScreen } from "@/types/game";

type TitleCardScreen = Extract<EraScreen, { kind: "titleCard" }>;

export function EraIntro({
  screen,
  onContinue,
  onEasterEgg,
}: {
  screen: TitleCardScreen;
  onContinue: () => void;
  onEasterEgg?: (badgeId: string) => void;
}) {
  const theme = useEraTheme();
  const reducedMotion = useReducedMotion();
  const [tapCount, setTapCount] = useState(0);
  const [eggMessage, setEggMessage] = useState<string | null>(null);
  const egg = screen.titleTapEasterEgg;

  function handleTitleTap() {
    if (!egg || eggMessage) return;
    const next = tapCount + 1;
    setTapCount(next);
    if (next >= egg.tapsRequired) {
      setEggMessage(egg.message);
      onEasterEgg?.(egg.badge.id);
    }
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
      <motion.p
        initial={reducedMotion ? false : { opacity: 0 }}
        animate={{ opacity: 0.75 }}
        transition={{ duration: 0.5 }}
        className="text-xs font-semibold tracking-[0.35em]"
      >
        {screen.eraLabel}
      </motion.p>
      <motion.h1
        initial={reducedMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        style={{ fontFamily: theme.titleFontFamily, color: theme.foreground }}
        className="text-5xl"
        onClick={egg ? handleTitleTap : undefined}
        role={egg ? "button" : undefined}
        aria-label={egg ? `${screen.title} (toque no título)` : undefined}
      >
        {screen.title}
      </motion.h1>
      <motion.p
        initial={reducedMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="max-w-xs whitespace-pre-line text-[16px] leading-relaxed opacity-90"
      >
        {screen.tagline}
      </motion.p>
      {eggMessage ? (
        <p className="max-w-xs text-sm opacity-80">{eggMessage}</p>
      ) : null}
      <motion.div
        initial={reducedMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="w-full max-w-xs"
      >
        <ChoiceButton onClick={onContinue}>{screen.cta}</ChoiceButton>
      </motion.div>
    </div>
  );
}
