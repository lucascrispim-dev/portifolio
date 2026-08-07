"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Contadores da sessão atual: quantos toques o jogador deu e há quanto
 * tempo a página está aberta.
 *
 * Ficam **fora** do `GameProgress` de propósito. Contar toque no estado
 * persistido significaria uma escrita no `localStorage` e uma
 * renderização da árvore inteira a cada toque — o suficiente para
 * engasgar as animações no celular. Aqui o número vive num ref e só vira
 * estado quando o painel de estatísticas está aberto para lê-lo.
 */
export function useSessionStats() {
  const taps = useRef(0);
  /** Zero até montar: ler o relógio durante a renderização não é puro. */
  const startedAt = useRef(0);
  const [snapshot, setSnapshot] = useState({ taps: 0, elapsedMs: 0 });
  const [watching, setWatching] = useState(false);

  useEffect(() => {
    if (startedAt.current === 0) startedAt.current = Date.now();
  }, []);

  const registerTap = useCallback(() => {
    taps.current += 1;
  }, []);

  /**
   * O painel avisa quando está aberto. Só então os números começam a ser
   * publicados — de segundo em segundo, e não a cada toque.
   */
  useEffect(() => {
    if (!watching) return;

    function publish() {
      setSnapshot({
        taps: taps.current,
        elapsedMs: startedAt.current === 0 ? 0 : Date.now() - startedAt.current,
      });
    }

    publish();
    const interval = window.setInterval(publish, 1000);
    return () => window.clearInterval(interval);
  }, [watching]);

  return { registerTap, snapshot, setWatching };
}

/** "12 min 34 s" — o formato que o painel exibe. */
export function formatElapsed(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes === 0) return `${seconds} s`;
  return `${minutes} min ${String(seconds).padStart(2, "0")} s`;
}
