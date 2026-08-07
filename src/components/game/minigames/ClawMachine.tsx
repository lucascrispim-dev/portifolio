"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChoiceButton } from "@/components/game/ChoiceButton";
import { InventoryGlyph } from "@/components/game/InventoryGlyph";
import { NarratorText } from "@/components/game/NarratorText";
import { useEraTheme } from "@/components/game/EraThemeProvider";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { pace } from "@/lib/pacing";
import { playEffect } from "@/lib/audio";

/**
 * A GARRA — Era II.
 *
 * A referência é óbvia e é para ser: a garra do Toy Story, o filme que
 * este jogo já perguntou duas vezes e vai perguntar de novo. A mecânica
 * é a piada clássica de máquina de pelúcia — o jogador escolhe onde a
 * garra desce, e ela erra. Duas vezes, sempre, independente da escolha.
 *
 * A terceira desce sozinha, sem ele escolher nada, e acerta. É o resumo
 * do jogo inteiro em trinta segundos: as escolhas não mudam o resultado,
 * mas o resultado é bom.
 */

const SLOTS = [
  { id: "esquerda", label: "ESQUERDA", x: 18 },
  { id: "meio", label: "MEIO", x: 50 },
  { id: "direita", label: "DIREITA", x: 82 },
];

/** O que a garra pega nas duas primeiras descidas. Nunca é o prêmio. */
const CONSOLATION = [
  {
    caught: "NADA",
    line: "A garra desceu.\nA garra subiu.\nA garra não trouxe nada.",
  },
  {
    caught: "AR",
    line: "Dessa vez ela pegou ar.\nUma quantidade\nimpressionante de ar.",
  },
];

type Phase = "aiming" | "dropping" | "result" | "auto" | "won";

export function ClawMachine({
  onDone,
  onCollect,
  onPatienceDrop,
}: {
  onDone: () => void;
  onCollect: (itemId: string) => void;
  onPatienceDrop: () => void;
}) {
  const theme = useEraTheme();
  const reducedMotion = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("aiming");
  const [attempt, setAttempt] = useState(0);
  const [clawX, setClawX] = useState(50);
  const [wonDone, setWonDone] = useState(false);

  function aim(x: number) {
    if (phase !== "aiming") return;
    playEffect("tap");
    setClawX(x);
    setPhase("dropping");
  }

  /** Descida manual: erra, sempre. */
  useEffect(() => {
    if (phase !== "dropping") return;
    const timer = window.setTimeout(() => {
      // A segunda falha seguida é o que justifica a queda de paciência —
      // uma só ainda é engraçada, duas já é sabotagem.
      if (attempt === 1) onPatienceDrop();
      setPhase("result");
    }, pace(1700, reducedMotion));
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, attempt, reducedMotion]);

  /** Terceira descida: o sistema assume o controle e acerta. */
  useEffect(() => {
    if (phase !== "auto") return;
    const timer = window.setTimeout(() => {
      playEffect("badge");
      onCollect("controle-toy-story");
      setPhase("won");
    }, pace(2100, reducedMotion));
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, reducedMotion]);

  function nextAttempt() {
    const next = attempt + 1;
    setAttempt(next);
    if (next >= CONSOLATION.length) {
      // A garra volta ao centro antes de descer sozinha: o jogador não
      // escolhe esta, e o movimento até o meio é o aviso disso.
      setClawX(50);
      setPhase("auto");
      return;
    }
    setPhase("aiming");
  }

  const clawDown = phase === "dropping" || phase === "auto";

  return (
    <div className="flex flex-1 flex-col justify-center gap-6">
      <p className="text-center font-mono text-xs tracking-[0.28em] opacity-70">
        A GARRA
      </p>

      {/* A máquina. */}
      <div
        className="relative h-56 w-full overflow-hidden border"
        style={{
          borderColor: `${theme.foreground}33`,
          borderRadius: theme.radius,
          backgroundColor: `${theme.foreground}0d`,
        }}
      >
        {/* Trilho superior. */}
        <div
          className="absolute inset-x-3 top-4 h-px"
          style={{ backgroundColor: `${theme.foreground}40` }}
        />

        <motion.div
          className="absolute top-4 flex flex-col items-center"
          animate={{
            left: `${clawX}%`,
            y: clawDown ? 96 : 0,
          }}
          transition={{
            left: { duration: reducedMotion ? 0 : 0.5 },
            y: { duration: reducedMotion ? 0 : 1.1, ease: "easeInOut" },
          }}
          style={{ x: "-50%" }}
        >
          <div
            className="h-6 w-px"
            style={{ backgroundColor: `${theme.foreground}66` }}
          />
          <svg
            viewBox="0 0 24 20"
            width="30"
            height="26"
            aria-hidden
            fill="none"
            stroke={theme.accent}
            strokeWidth="1.6"
            strokeLinecap="round"
          >
            <path d="M4 3v6l4 5M20 3v6l-4 5M12 2v6" />
          </svg>
        </motion.div>

        {/* O prêmio, sempre no meio, sempre visível, sempre inalcançável
            até o sistema decidir o contrário. */}
        <div
          className="absolute bottom-5 left-1/2 -translate-x-1/2"
          style={{ color: theme.accent, opacity: phase === "won" ? 0 : 0.9 }}
        >
          <InventoryGlyph kind="remote" size={34} />
        </div>

        <div
          className="absolute inset-x-0 bottom-0 h-4"
          style={{ backgroundColor: `${theme.foreground}1a` }}
        />
      </div>

      {phase === "aiming" ? (
        <div className="flex flex-col gap-3">
          <p className="text-center text-[13px] opacity-70">
            {attempt === 0
              ? "Escolha onde a garra desce."
              : "Escolha de novo. Dessa vez pensa direito."}
          </p>
          <div className="flex gap-2">
            {SLOTS.map((slot) => (
              <ChoiceButton
                key={slot.id}
                variant="secondary"
                onClick={() => aim(slot.x)}
                className="flex-1 px-2 text-[13px]"
              >
                {slot.label}
              </ChoiceButton>
            ))}
          </div>
        </div>
      ) : null}

      {phase === "dropping" || phase === "auto" ? (
        <p className="text-center font-mono text-xs tracking-[0.2em] opacity-60">
          {phase === "auto" ? "ASSUMINDO O CONTROLE..." : "DESCENDO..."}
        </p>
      ) : null}

      {phase === "result" ? (
        <div className="flex flex-col gap-5">
          <p
            className="text-center font-mono text-sm tracking-[0.2em]"
            style={{ color: theme.accent }}
          >
            CAPTURADO: {CONSOLATION[attempt].caught}
          </p>
          <NarratorText
            lines={[{ text: CONSOLATION[attempt].line, pause: "short" }]}
          />
          <ChoiceButton onClick={nextAttempt}>
            {attempt === 0 ? "TENTAR DE NOVO" : "DE NOVO."}
          </ChoiceButton>
        </div>
      ) : null}

      {phase === "won" ? (
        <div className="flex flex-col gap-5">
          <NarratorText
            lines={[
              { text: "Peguei.", pause: "short" },
              { text: "Você não fez\nabsolutamente nada,", pause: "short" },
              { text: "mas peguei.", pause: "long" },
            ]}
            onDone={() => setWonDone(true)}
          />
          {wonDone ? (
            <ChoiceButton onClick={onDone}>CONTINUAR</ChoiceButton>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
