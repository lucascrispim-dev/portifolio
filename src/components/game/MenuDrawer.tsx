"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SoundToggle } from "@/components/game/SoundToggle";
import { useEraTheme } from "@/components/game/EraThemeProvider";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { projectConfig } from "@/config/project";
import { playEffect } from "@/lib/audio";

/**
 * Menu discreto. Existe sobretudo para esconder o contador de paciência —
 * quem for curioso o bastante para abrir encontra o quanto o sistema
 * acha que ele já se irritou.
 */
export function MenuDrawer({
  patience,
  patienceBroken,
  onOpenCountChange,
  onLogoTap,
}: {
  patience: number;
  /** Depois do falso reset o valor deixa de ser mensurável. */
  patienceBroken: boolean;
  onOpenCountChange: (count: number) => void;
  onLogoTap: () => void;
}) {
  const theme = useEraTheme();
  const reducedMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [opens, setOpens] = useState(0);
  const [brokenMessage, setBrokenMessage] = useState(false);

  function toggle() {
    playEffect("tap");
    const next = !open;
    setOpen(next);
    if (next) {
      const count = opens + 1;
      setOpens(count);
      onOpenCountChange(count);
    }
  }

  const filled = Math.max(0, Math.round((patience / 100) * 12));

  return (
    <div className="relative">
      <div className="flex items-center justify-between px-4 pt-2">
        {/* O logotipo não leva a lugar nenhum: é o alvo dos treze toques. */}
        <button
          type="button"
          onClick={onLogoTap}
          aria-label={projectConfig.projectName}
          className="min-h-11 font-mono text-[10px] tracking-[0.3em] opacity-40 focus-visible:outline focus-visible:outline-2"
        >
          P:NE
        </button>

        <div className="flex items-center gap-1">
          <SoundToggle />
          <button
            type="button"
            onClick={toggle}
            aria-expanded={open}
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            className="flex min-h-11 min-w-11 items-center justify-center text-lg opacity-50 transition-opacity hover:opacity-90 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2"
            style={{ color: theme.foreground }}
          >
            <span aria-hidden>{open ? "×" : "≡"}</span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute right-4 top-full z-50 w-60 rounded p-4"
            style={{
              backgroundColor: `${theme.background}f5`,
              border: `1px solid ${theme.foreground}33`,
              borderRadius: theme.radius,
            }}
          >
            <p className="font-mono text-[10px] tracking-[0.2em] opacity-60">
              PACIÊNCIA DE CACAU
            </p>

            {patienceBroken ? (
              <button
                type="button"
                onClick={() => setBrokenMessage(true)}
                className="mt-2 min-h-11 w-full text-left font-mono text-sm tracking-widest"
                style={{ color: theme.accent }}
              >
                ERRO
              </button>
            ) : (
              <>
                <p
                  className="mt-2 font-mono text-sm tracking-tight"
                  style={{ color: theme.accent }}
                  aria-hidden
                >
                  {"█".repeat(filled)}
                  {"░".repeat(12 - filled)}
                </p>
                <p className="mt-1 font-mono text-sm tabular-nums">{patience}%</p>
              </>
            )}

            {brokenMessage ? (
              <p className="mt-2 text-xs leading-relaxed opacity-80">
                Valor abaixo
                <br />
                do limite mensurável.
              </p>
            ) : null}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
