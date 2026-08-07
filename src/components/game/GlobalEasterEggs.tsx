"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { projectConfig } from "@/config/project";
import { playEffect } from "@/lib/audio";

const LOGO_TAPS_REQUIRED = 13;
const RAPID_CLICKS_REQUIRED = 5;
const RAPID_CLICK_WINDOW_MS = 1600;
const DEAD_TAPS_FOR_FINGER = 4;

export type GlobalEggEvent = {
  achievementId?: string;
  achievementTitle?: string;
  easterEggId: string;
  message: string;
};

/**
 * Camada sempre ativa dos easter eggs que não pertencem a nenhuma Era:
 * treze toques no logotipo, cliques apressados, toques em elementos sem
 * função e o "Long Live" ao acumular achievements.
 */
export function useGlobalEasterEggs({
  achievements,
  easterEggs,
  onEgg,
}: {
  achievements: string[];
  easterEggs: string[];
  onEgg: (event: GlobalEggEvent) => void;
}) {
  const [toast, setToast] = useState<string | null>(null);
  const logoTaps = useRef(0);
  const deadTaps = useRef(0);
  const recentClicks = useRef<number[]>([]);
  const onEggRef = useRef(onEgg);

  useEffect(() => {
    onEggRef.current = onEgg;
  });

  function show(message: string) {
    setToast(message);
  }

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 4200);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  /**
   * Long Live: dispara sozinho ao acumular achievements suficientes. O
   * anúncio é agendado (e não chamado direto no corpo do efeito) tanto
   * para não encadear renderizações quanto para não atropelar o troféu
   * que acabou de aparecer na tela.
   */
  useEffect(() => {
    if (easterEggs.includes("long-live")) return;
    if (achievements.length < projectConfig.longLiveThreshold) return;

    const message = "🏆 LONG LIVE\nVocê sobreviveu às referências.";
    const timeout = window.setTimeout(() => {
      onEggRef.current({
        achievementId: "long-live",
        achievementTitle: "LONG LIVE",
        easterEggId: "long-live",
        message,
      });
      setToast(message);
    }, 1800);
    return () => window.clearTimeout(timeout);
  }, [achievements.length, easterEggs]);

  function registerLogoTap() {
    logoTaps.current += 1;
    playEffect("tap");
    if (logoTaps.current < LOGO_TAPS_REQUIRED) return;
    logoTaps.current = 0;
    if (easterEggs.includes("lucky-number")) return;
    const message =
      "🏆 LUCKY NUMBER\nVocê encontrou o número mais previsível deste projeto.";
    onEggRef.current({
      achievementId: "lucky-number",
      achievementTitle: "LUCKY NUMBER",
      easterEggId: "lucky-number",
      message,
    });
    show(message);
  }

  /** Chamado por qualquer clique: detecta pressa. */
  function registerClick() {
    const now = Date.now();
    recentClicks.current = [...recentClicks.current, now].filter(
      (t) => now - t <= RAPID_CLICK_WINDOW_MS
    );
    if (recentClicks.current.length < RAPID_CLICKS_REQUIRED) return;
    recentClicks.current = [];
    if (easterEggs.includes("cacau-apressada")) return;
    const message = `Calma, ${projectConfig.playerTwoName}.\nAs Eras não vão fugir.`;
    onEggRef.current({ easterEggId: "cacau-apressada", message });
    show(message);
  }

  /** Chamado ao tocar em algo decorativo, sem função. */
  function registerDeadTap() {
    deadTaps.current += 1;
    if (deadTaps.current < DEAD_TAPS_FOR_FINGER) return;
    deadTaps.current = 0;
    show("🖕");
    if (!easterEggs.includes("o-dedo")) {
      onEggRef.current({ easterEggId: "o-dedo", message: "🖕" });
    }
  }

  return { toast, registerLogoTap, registerClick, registerDeadTap };
}

export function EasterEggToast({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 top-14 z-50 flex justify-center px-6"
    >
      <motion.p
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xs whitespace-pre-line rounded bg-black/85 px-4 py-3 text-center font-mono text-xs leading-relaxed text-neutral-100"
      >
        {message}
      </motion.p>
    </div>
  );
}
