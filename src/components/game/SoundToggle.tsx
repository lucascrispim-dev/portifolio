"use client";

import { useSyncExternalStore } from "react";
import { useEraTheme } from "@/components/game/EraThemeProvider";
import {
  getSoundServerSnapshot,
  getSoundSnapshot,
  playEffect,
  setSoundEnabled,
  subscribeSound,
} from "@/lib/audio";

/**
 * Controle discreto de som, no canto superior direito. Fica fora do fluxo
 * narrativo de propósito: o jogo funciona perfeitamente sem áudio e o som
 * começa desligado.
 */
export function SoundToggle() {
  const theme = useEraTheme();
  const on = useSyncExternalStore(
    subscribeSound,
    getSoundSnapshot,
    getSoundServerSnapshot
  );

  function toggle() {
    const next = !on;
    setSoundEnabled(next);
    if (next) playEffect("tap");
  }

  return (
    <div className="flex justify-end px-4 pt-2">
      <button
        type="button"
        onClick={toggle}
        aria-pressed={on}
        aria-label={on ? "Desativar sons" : "Ativar sons"}
        className="flex min-h-11 min-w-11 items-center justify-center rounded-full text-sm opacity-50 transition-opacity hover:opacity-90 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        style={{ color: theme.foreground }}
      >
        <span aria-hidden>{on ? "♪" : "♪̸"}</span>
      </button>
    </div>
  );
}
