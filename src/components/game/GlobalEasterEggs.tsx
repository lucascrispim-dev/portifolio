"use client";

import { useEffect, useRef } from "react";
import { useNotify } from "@/components/game/SystemNotifications";
import { observationLines, projectConfig } from "@/config/project";
import { playEffect } from "@/lib/audio";

const LOGO_TAPS_REQUIRED = 13;
const RAPID_CLICKS_REQUIRED = 5;
const RAPID_CLICK_WINDOW_MS = 1600;
const DEAD_TAPS_FOR_FINGER = 4;
/**
 * De quantos em quantos toques o narrador comenta alguma coisa sem ser
 * chamado. Múltiplo de 13, como todo número deste jogo, e espaçado o
 * bastante para a observação parecer um sobressalto e não um relógio.
 */
const TAPS_PER_OBSERVATION = 39;

export type GlobalEggEvent = {
  achievementId?: string;
  easterEggId: string;
};

/**
 * Camada sempre ativa dos easter eggs que não pertencem a nenhuma Era:
 * treze toques no logotipo, cliques apressados, toques em elementos sem
 * função e o "Long Live" ao acumular achievements.
 *
 * As mensagens saem pela central de notificações, na mesma fila dos
 * avisos do sistema e dos eventos ambientes de cada Era — de propósito.
 * Para o jogador, descobrir um easter egg e o sistema resolver comentar
 * alguma coisa sozinho precisam parecer a mesma categoria de evento.
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
  const notify = useNotify();
  const logoTaps = useRef(0);
  const deadTaps = useRef(0);
  const totalTaps = useRef(0);
  const observationIndex = useRef(0);
  const recentClicks = useRef<number[]>([]);
  const onEggRef = useRef(onEgg);
  const notifyRef = useRef(notify);

  useEffect(() => {
    onEggRef.current = onEgg;
    notifyRef.current = notify;
  });

  /**
   * Long Live: dispara sozinho ao acumular achievements suficientes. O
   * anúncio é agendado (e não chamado direto no corpo do efeito) tanto
   * para não encadear renderizações quanto para não atropelar o troféu
   * que acabou de aparecer na tela.
   */
  useEffect(() => {
    if (easterEggs.includes("long-live")) return;
    if (achievements.length < projectConfig.longLiveThreshold) return;

    const timeout = window.setTimeout(() => {
      onEggRef.current({
        achievementId: "long-live",
        easterEggId: "long-live",
      });
      notifyRef.current({
        title: "🏆 LONG LIVE",
        body: "Você sobreviveu às referências.",
        tone: "reward",
      });
    }, 1800);
    return () => window.clearTimeout(timeout);
  }, [achievements.length, easterEggs]);

  function registerLogoTap() {
    logoTaps.current += 1;
    playEffect("tap");
    if (logoTaps.current < LOGO_TAPS_REQUIRED) return;
    logoTaps.current = 0;
    if (easterEggs.includes("lucky-number")) return;
    onEggRef.current({
      achievementId: "lucky-number",
      easterEggId: "lucky-number",
    });
    notify({
      title: "🏆 LUCKY NUMBER",
      body: "Você encontrou o número mais previsível deste projeto.",
      tone: "reward",
    });
  }

  /**
   * Chamado por qualquer clique: detecta pressa e, de tempos em tempos,
   * faz o narrador comentar sem ter sido chamado.
   *
   * A observação espontânea é o jeito mais barato de manter viva a
   * premissa do jogo inteiro — a de que existe alguém do outro lado
   * prestando atenção. Ela não recompensa nada e não pede resposta:
   * chega, constata e some.
   */
  function registerClick() {
    totalTaps.current += 1;
    if (totalTaps.current % TAPS_PER_OBSERVATION === 0) {
      const line = observationLines[observationIndex.current % observationLines.length];
      observationIndex.current += 1;
      notify({ title: "OBSERVAÇÃO", body: line });
    }

    const now = Date.now();
    recentClicks.current = [...recentClicks.current, now].filter(
      (t) => now - t <= RAPID_CLICK_WINDOW_MS
    );
    if (recentClicks.current.length < RAPID_CLICKS_REQUIRED) return;
    recentClicks.current = [];
    if (easterEggs.includes("cacau-apressada")) return;
    onEggRef.current({ easterEggId: "cacau-apressada" });
    notify({
      title: "OBSERVAÇÃO",
      body: `Calma, ${projectConfig.playerTwoJokeName}.\nAs Eras não vão fugir.`,
    });
  }

  /** Chamado ao tocar em algo decorativo, sem função. */
  function registerDeadTap() {
    deadTaps.current += 1;
    if (deadTaps.current < DEAD_TAPS_FOR_FINGER) return;
    deadTaps.current = 0;
    notify({ title: "🖕", durationMs: 2600 });
    if (!easterEggs.includes("o-dedo")) {
      onEggRef.current({ easterEggId: "o-dedo" });
    }
  }

  return { registerLogoTap, registerClick, registerDeadTap };
}
