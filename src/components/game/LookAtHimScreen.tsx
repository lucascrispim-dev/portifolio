"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { projectConfig } from "@/config/project";

/**
 * A tela terminal. Só existe a frase — nenhum botão, contador, pergunta
 * ou dica. Do ponto de vista do Cauã o jogo acabou aqui, e o pedido
 * acontece fora da tela. **Nunca** adicione interação visível a partir
 * deste ponto.
 *
 * O que existe é invisível e é do Lucas: um toque longo de 2s no canto
 * inferior direito destrava a continuação. Como o gesto vai ser feito com
 * a mão tremendo e o celular na mão de outra pessoa, existe também um
 * timer de segurança — se nada acontecer em alguns minutos, a
 * continuação dispara sozinha. Um gesto errado não pode deixar a noite
 * travada nesta tela.
 */
export function LookAtHimScreen({ onTrigger }: { onTrigger: () => void }) {
  const reducedMotion = useReducedMotion();
  const firedRef = useRef(false);
  const holdTimerRef = useRef<number | null>(null);
  const [holding, setHolding] = useState(false);

  function fire() {
    if (firedRef.current) return;
    firedRef.current = true;
    onTrigger();
  }

  function clearHold() {
    if (holdTimerRef.current !== null) {
      window.clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    setHolding(false);
  }

  function startHold() {
    if (firedRef.current || holdTimerRef.current !== null) return;
    setHolding(true);
    holdTimerRef.current = window.setTimeout(() => {
      holdTimerRef.current = null;
      setHolding(false);
      fire();
    }, projectConfig.finalTriggerHoldMs);
  }

  // Rede de segurança: independente do gesto.
  useEffect(() => {
    const timer = window.setTimeout(fire, projectConfig.finalTriggerFallbackMs);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => () => clearHold(), []);

  return (
    <div className="relative flex flex-1 flex-col items-center justify-center bg-black px-8 text-center">
      <motion.p
        initial={reducedMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reducedMotion ? 0 : 1.8 }}
        className="font-serif text-3xl text-neutral-50"
      >
        Olha para ele.
      </motion.p>

      {/*
        Alvo do toque longo. Sem rótulo, sem contorno, sem feedback
        perceptível: `holding` existe só para o ensaio no painel de dev,
        e some completamente da tela publicada.
      */}
      <div
        aria-hidden
        data-final-trigger={holding ? "holding" : "idle"}
        onPointerDown={startHold}
        onPointerUp={clearHold}
        onPointerCancel={clearHold}
        onPointerLeave={clearHold}
        onContextMenu={(event) => event.preventDefault()}
        className="absolute bottom-0 right-0 h-32 w-32 select-none"
        style={{ touchAction: "none", WebkitTapHighlightColor: "transparent" }}
      />
    </div>
  );
}
