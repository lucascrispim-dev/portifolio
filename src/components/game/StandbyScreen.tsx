"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { SpontaneousNarrator } from "@/components/game/SpontaneousNarrator";
import { useEraTheme } from "@/components/game/EraThemeProvider";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/** Depois disso, um caminho discreto de volta aparece (ver comentário abaixo). */
const FALLBACK_DELAY_MS = 45_000;

/**
 * Tela mínima de espera: o jogador aceitou a missão e o jogo sai do
 * caminho até que o acontecimento real tenha ocorrido. Nada aqui revela
 * o final, o prêmio ou quanto falta — apenas orienta a voltar para a
 * vida real (roteiro Era I, seção 9).
 *
 * O caminho normal de volta é reabrir o app (recarregar) ou desbloquear o
 * celular depois de guardá-lo — ambos tratados por quem renderiza esta
 * tela. O link discreto após `FALLBACK_DELAY_MS` é só uma rede de
 * segurança para quem deixou a aba aberta e visível: ele não abre nenhum
 * atalho novo, já que recarregar a página leva ao mesmo lugar.
 */
export function StandbyScreen({
  returnCount,
  onReturn,
}: {
  returnCount: number;
  onReturn: () => void;
}) {
  const theme = useEraTheme();
  const reducedMotion = useReducedMotion();
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => setShowFallback(true), FALLBACK_DELAY_MS);
    return () => window.clearTimeout(timeout);
  }, []);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 text-center">
      <motion.p
        initial={reducedMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="font-mono text-2xl"
        style={{ color: theme.accent }}
        aria-hidden
      >
        <span className={reducedMotion ? "" : "animate-pulse"}>_</span>
      </motion.p>

      <motion.div
        initial={reducedMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="flex flex-col gap-2"
      >
        <p className="text-[17px] leading-relaxed">
          Pode guardar o celular.
        </p>
        <p className="text-[15px] opacity-75">
          A próxima parte acontece fora da tela.
        </p>
      </motion.div>

      <SpontaneousNarrator seed={returnCount} className="max-w-[240px]" />

      {showFallback ? (
        <motion.button
          type="button"
          initial={reducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 0.55 }}
          transition={{ duration: 1.4 }}
          onClick={onReturn}
          className="min-h-11 text-sm underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          style={{ color: theme.foreground }}
        >
          Voltei.
        </motion.button>
      ) : null}
    </div>
  );
}
