"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void): () => void {
  const media = window.matchMedia(QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

function getSnapshot(): boolean {
  return window.matchMedia(QUERY).matches;
}

/**
 * Reflete `prefers-reduced-motion`, reagindo a mudanças ao vivo.
 *
 * Usa `useSyncExternalStore` porque o valor é diferente no servidor e no
 * cliente: ler a media query direto no estado inicial fazia a primeira
 * renderização do cliente divergir do HTML do servidor e quebrava a
 * hidratação (React #418) para quem tem movimento reduzido ativado. Com
 * o snapshot de servidor fixo em `false`, o React hidrata com o mesmo
 * resultado e só então aplica o valor real.
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
