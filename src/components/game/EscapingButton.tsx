"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ConfettiExplosion } from "@/components/game/ConfettiExplosion";
import { useEraTheme } from "@/components/game/EraThemeProvider";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import {
  pickEscapePosition,
  resolveNoButtonTap,
  type EscapePosition,
} from "@/lib/no-button";

const INITIAL_POSITION: EscapePosition = { xPercent: 50, yPercent: 60 };

function positionForAttempts(attempts: number): EscapePosition {
  return attempts > 0 ? pickEscapePosition(attempts - 1) : INITIAL_POSITION;
}

function vibrate(pattern: number | number[]) {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    try {
      navigator.vibrate(pattern);
    } catch {
      // dispositivo não suporta — silenciosamente ignorado
    }
  }
}

export function EscapingButton({
  initialAttempts = 0,
  onAttemptsChange,
  onMessage,
  onDestroyed,
  label = "Não",
}: {
  initialAttempts?: number;
  onAttemptsChange: (attempts: number) => void;
  onMessage?: (message: string | null) => void;
  onDestroyed: () => void;
  label?: string;
}) {
  const theme = useEraTheme();
  const reducedMotion = useReducedMotion();
  const [attempts, setAttempts] = useState(initialAttempts);
  const [position, setPosition] = useState<EscapePosition>(
    positionForAttempts(initialAttempts)
  );
  const [exploding, setExploding] = useState(false);
  const [visible, setVisible] = useState(true);
  const onMessageRef = useRef(onMessage);

  useEffect(() => {
    onMessageRef.current = onMessage;
  });

  useEffect(() => {
    if (attempts === 0) onMessageRef.current?.(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleTap() {
    if (exploding) return;
    const outcome = resolveNoButtonTap(attempts);

    if (outcome.kind === "escaped") {
      setPosition(outcome.position);
      setAttempts(outcome.attempts);
      onAttemptsChange(outcome.attempts);
      onMessageRef.current?.(outcome.message);
      vibrate(15);
      return;
    }

    setAttempts(outcome.attempts);
    onAttemptsChange(outcome.attempts);
    onMessageRef.current?.(null);
    setExploding(true);
    vibrate([40, 30, 60]);
    window.setTimeout(() => {
      setVisible(false);
      onDestroyed();
    }, reducedMotion ? 50 : 700);
  }

  if (!visible) return null;

  return (
    <>
      <motion.button
        type="button"
        aria-label={label}
        onClick={handleTap}
        className="absolute z-20 min-h-11 min-w-[96px] -translate-x-1/2 -translate-y-1/2 px-6 py-3 text-[15px] font-semibold text-white shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        style={{
          left: `${position.xPercent}%`,
          top: `${position.yPercent}%`,
          backgroundColor: "#C13B33",
          borderRadius: theme.radius,
        }}
        animate={
          exploding && !reducedMotion
            ? { x: [0, -3, 3, -2, 2, 0], scale: [1, 1.05, 0.95, 1] }
            : { left: `${position.xPercent}%`, top: `${position.yPercent}%` }
        }
        transition={{ duration: exploding ? 0.4 : 0.35, ease: "easeInOut" }}
      >
        {exploding ? "" : label}
      </motion.button>
      {exploding ? (
        <ConfettiExplosion
          originXPercent={position.xPercent}
          originYPercent={position.yPercent}
        />
      ) : null}
    </>
  );
}
