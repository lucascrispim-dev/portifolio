"use client";

import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { transition, type GameAction } from "@/lib/game-machine";
import { consumeRestartRequest } from "@/lib/restart";
import { createInitialProgress, loadProgress, saveProgress } from "@/lib/storage";
import type { GameProgress } from "@/types/game";

/**
 * Fonte única do progresso do jogo: carrega do localStorage no primeiro
 * render do cliente, mantém em memória via reducer puro (game-machine) e
 * persiste a cada mudança. O estado inicial do servidor é sempre o
 * progresso "zerado" para evitar divergência de hidratação — a
 * recuperação real acontece em um useEffect após montar no cliente.
 *
 * O efeito de gravação só persiste depois que `progress` deixou de ser,
 * por identidade de objeto, o placeholder zerado com que o componente
 * montou (`initialSnapshot`). Isso evita qualquer escrita prematura do
 * estado zerado por cima do progresso salvo — inclusive sob o
 * duplo-efeito do React Strict Mode em dev, que roda os efeitos de
 * montagem duas vezes antes do primeiro `dispatch` realmente aplicar.
 * `hydratedRef` só evita ler o localStorage duas vezes; não é ela quem
 * protege contra a corrida.
 */
export function useGameProgress() {
  const [progress, dispatch] = useReducer(transition, undefined, createInitialProgress);
  const [initialSnapshot] = useState(progress);
  const hydratedRef = useRef(false);

  useEffect(() => {
    if (hydratedRef.current) return;
    hydratedRef.current = true;
    // `?reiniciar` na URL apaga o salvo antes de qualquer leitura, então
    // o que se recupera abaixo já é o estado zerado (ver lib/restart.ts).
    consumeRestartRequest();
    const restored = loadProgress();
    dispatch({ type: "HYDRATE", progress: restored });
  }, []);

  useEffect(() => {
    if (progress === initialSnapshot) return;
    saveProgress(progress);
  }, [progress, initialSnapshot]);

  /**
   * Trocar só o hash (`#reiniciar`) não recarrega a página, então o efeito
   * de hidratação acima nunca voltaria a rodar. Sem isto, essa forma de
   * reiniciar simplesmente não funcionaria com a página já aberta.
   */
  useEffect(() => {
    function handleHashChange() {
      if (consumeRestartRequest()) dispatch({ type: "RESET" });
    }
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const dispatchAction = useCallback((action: GameAction) => dispatch(action), []);

  return { progress, dispatch: dispatchAction };
}

export type { GameProgress };
