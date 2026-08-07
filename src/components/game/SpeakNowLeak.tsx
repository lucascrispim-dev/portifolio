"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChoiceButton } from "@/components/game/ChoiceButton";
import { NarratorText } from "@/components/game/NarratorText";
import { TypewriterText } from "@/components/game/TypewriterText";
import { useEraTheme } from "@/components/game/EraThemeProvider";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { eraThreeLeak } from "@/config/personalities";
import { pace } from "@/lib/pacing";

type Phase = "leading" | "leaking" | "redacting" | "after";

/**
 * O vazamento.
 *
 * Este é o único momento em que a Era XIII entra no jogo, e ele precisa
 * parecer um acidente. Por isso a ordem importa tanto: a frase proibida
 * é digitada **inteira**, fica legível por um instante, e só então o
 * sistema tenta apagá-la na frente do jogador. Se a censura chegasse
 * antes, viraria um anúncio; chegando depois, vira um deslize.
 *
 * É também o motivo de o narrador da Era III falar demais o tempo todo:
 * quando o deslize acontece, ele já estabeleceu que essa é a fraqueza
 * dele. O jogador conclui sozinho — e essa conclusão é dele, não do
 * roteiro.
 */
export function SpeakNowLeak({
  onDiscover,
  onDone,
  cta = "CONTINUAR",
}: {
  onDiscover: () => void;
  onDone: () => void;
  cta?: string;
}) {
  const theme = useEraTheme();
  const reducedMotion = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("leading");
  const [afterDone, setAfterDone] = useState(false);

  /** Tempo de leitura antes da censura cair. */
  useEffect(() => {
    if (phase !== "leaking") return;
    const timer = window.setTimeout(
      () => setPhase("redacting"),
      pace(1500, reducedMotion)
    );
    return () => window.clearTimeout(timer);
  }, [phase, reducedMotion]);

  /** A descoberta é registrada assim que a censura aparece. */
  useEffect(() => {
    if (phase !== "redacting") return;
    onDiscover();
    const timer = window.setTimeout(
      () => setPhase("after"),
      pace(1600, reducedMotion)
    );
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, reducedMotion]);

  return (
    <div className="flex flex-1 flex-col justify-center gap-6">
      <NarratorText
        lines={[
          { text: "Você está indo\nmelhor do que\no previsto.", pause: "short" },
          { text: "O que é ótimo,", pause: "short" },
        ]}
        onDone={() => setPhase("leaking")}
      />

      {phase !== "leading" ? (
        <p className="whitespace-pre-line text-[17px] leading-relaxed">
          {phase === "leaking" ? (
            <TypewriterText text={eraThreeLeak.leaked} />
          ) : (
            <motion.span
              initial={reducedMotion ? false : { opacity: 0.4 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.35 }}
              style={{ color: theme.accent }}
            >
              {eraThreeLeak.redacted}
            </motion.span>
          )}
        </p>
      ) : null}

      {phase === "redacting" ? (
        <motion.p
          initial={reducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-mono text-[10px] tracking-[0.24em]"
          style={{ color: theme.accent }}
        >
          APLICANDO SIGILO...
        </motion.p>
      ) : null}

      {phase === "after" ? (
        <div className="flex flex-col gap-5">
          <NarratorText
            lines={eraThreeLeak.after}
            onDone={() => setAfterDone(true)}
          />
          {afterDone ? (
            <ChoiceButton onClick={onDone}>{cta}</ChoiceButton>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
