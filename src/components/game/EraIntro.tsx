"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChoiceButton } from "@/components/game/ChoiceButton";
import { NarratorText } from "@/components/game/NarratorText";
import { useEraTheme } from "@/components/game/EraThemeProvider";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { EraScreen } from "@/types/game";

type TitleCardScreen = Extract<EraScreen, { kind: "titleCard" }>;

export function EraIntro({
  screen,
  onContinue,
  onDeadTap,
}: {
  screen: TitleCardScreen;
  onContinue: () => void;
  onDeadTap?: () => void;
}) {
  const theme = useEraTheme();
  const reducedMotion = useReducedMotion();
  const [taglineDone, setTaglineDone] = useState(false);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
      <motion.p
        initial={reducedMotion ? false : { opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ duration: 0.5 }}
        className="font-mono text-xs tracking-[0.35em]"
      >
        {screen.eraLabel}
      </motion.p>

      {/* O título não tem função — tocar nele alimenta o easter egg do dedo. */}
      <motion.h1
        initial={reducedMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        onClick={onDeadTap}
        style={{ fontFamily: theme.titleFontFamily, color: theme.foreground }}
        className="text-5xl"
      >
        {screen.title}
      </motion.h1>

      <NarratorText
        lines={screen.tagline}
        onDone={() => setTaglineDone(true)}
        className="flex flex-col gap-3 text-center"
        lineClassName="max-w-xs whitespace-pre-line text-[16px] leading-relaxed opacity-90"
      />

      {taglineDone ? (
        <motion.div
          initial={reducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-xs"
        >
          <ChoiceButton onClick={onContinue}>{screen.cta}</ChoiceButton>
        </motion.div>
      ) : null}
    </div>
  );
}
