"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AchievementCard } from "@/components/game/AchievementCard";
import { ConfettiExplosion } from "@/components/game/ConfettiExplosion";
import { NarratorText } from "@/components/game/NarratorText";
import { useLongPress } from "@/hooks/useLongPress";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { projectConfig } from "@/config/project";
import { pace } from "@/lib/pacing";
import { afterYesLines, closingLines } from "@/content/final-script";
import type { Achievement } from "@/types/game";

const THE_NEXT_ERA: Achievement = {
  id: "the-next-era",
  title: "THE NEXT ERA",
};

/** Bem mais longo que o gatilho do final: aqui não pode haver engano. */
const RESTART_HOLD_MS = 4000;

type Step =
  | "received"
  | "yes"
  | "compatibility"
  | "theOne"
  | "eraCard"
  | "closing"
  | "namorados";

/** Duração de cada etapa automática. `0` = a própria etapa decide. */
const DURATIONS: Record<Step, number> = {
  received: 2600,
  yes: 3400,
  compatibility: 3600,
  theOne: 0,
  eraCard: 6000,
  closing: 0,
  namorados: 0,
};

const NEXT: Partial<Record<Step, Step>> = {
  received: "yes",
  yes: "compatibility",
  compatibility: "theOne",
  eraCard: "closing",
};

/** Origens fixas dos confetes — sem aleatoriedade durante a renderização. */
const CONFETTI_ORIGINS = [
  { x: 20, y: 28 },
  { x: 78, y: 22 },
  { x: 34, y: 62 },
  { x: 66, y: 70 },
  { x: 50, y: 42 },
];

/**
 * A continuação depois do "sim" — a única parte do jogo que o Cauã não
 * dispara. Só roda quando o Lucas aciona o gatilho da tela final, então
 * daqui em diante o sistema pode finalmente parar de mentir: a barra
 * chega em 100% pela primeira e única vez.
 */
export function AfterYesSequence({
  onAchievement,
  onRestart,
}: {
  onAchievement: (id: string) => void;
  /** Recomeço do zero, só depois que a última tela chegou. */
  onRestart: () => void;
}) {
  const reducedMotion = useReducedMotion();
  const [step, setStep] = useState<Step>("received");

  useEffect(() => {
    const next = NEXT[step];
    if (!next) return;
    const timer = window.setTimeout(
      () => setStep(next),
      pace(DURATIONS[step], reducedMotion)
    );
    return () => window.clearTimeout(timer);
  }, [step, reducedMotion]);

  return (
    <div className="relative flex flex-1 flex-col items-center justify-center gap-6 overflow-hidden bg-black px-8 text-center text-neutral-100">
      {step === "received" ? (
        <Fade>
          <p className="font-mono text-xs tracking-[0.35em] text-neutral-500">
            RESPOSTA RECEBIDA
          </p>
        </Fade>
      ) : null}

      {step === "yes" ? (
        <>
          <StrongConfetti />
          <motion.p
            initial={reducedMotion ? false : { scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 180, damping: 14 }}
            className="font-serif text-7xl tracking-[0.1em] text-neutral-50"
          >
            SIM
          </motion.p>
        </>
      ) : null}

      {step === "compatibility" ? <FinalCompatibility /> : null}

      {step === "theOne" ? (
        <NarratorText
          lines={afterYesLines}
          onDone={() => setStep("eraCard")}
          lineClassName="whitespace-pre-line text-[18px] leading-relaxed"
        />
      ) : null}

      {step === "eraCard" ? (
        <Fade>
          <p className="font-mono text-xs tracking-[0.35em] text-neutral-500">
            ERA XIII
          </p>
          <p className="pt-1 font-serif text-3xl text-neutral-50">
            THE NEXT ERA
          </p>
          <p className="pt-3 font-mono text-sm tracking-[0.3em] text-neutral-300">
            INICIADA
          </p>
          <p className="pt-4 font-mono text-sm tabular-nums text-neutral-500">
            {projectConfig.startDate}
          </p>
          <p className="font-mono text-sm text-neutral-300">
            {projectConfig.playerOneName} e {projectConfig.playerTwoRealName}
          </p>
        </Fade>
      ) : null}

      {step === "closing" ? (
        <NarratorText
          lines={closingLines}
          onDone={() => setStep("namorados")}
          lineClassName="whitespace-pre-line text-[18px] leading-relaxed"
        />
      ) : null}

      {step === "namorados" ? (
        <>
          <RestartCorner onRestart={onRestart} />
          <div className="flex flex-col items-center gap-8">
            <motion.p
              initial={reducedMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reducedMotion ? 0 : 1.6 }}
              className="font-serif text-4xl tracking-[0.12em] text-neutral-50"
            >
              NAMORADOS
            </motion.p>
            <AchievementCard achievement={THE_NEXT_ERA} onUnlock={onAchievement} />
          </div>
        </>
      ) : null}
    </div>
  );
}

/**
 * Recomeçar do zero, para testar de novo.
 *
 * Só existe nesta tela — depois do NAMORADOS não há mais nada a
 * estragar — e só responde a um toque longo de 4s no canto **esquerdo**,
 * oposto ao gatilho do final, para que os dois gestos nunca se confundam.
 * Continua sem rótulo e sem contorno: quem não souber que está ali não
 * encontra por acaso.
 */
function RestartCorner({ onRestart }: { onRestart: () => void }) {
  const { handlers } = useLongPress(onRestart, RESTART_HOLD_MS);
  return (
    <div
      aria-hidden
      data-restart-trigger
      {...handlers}
      className="absolute bottom-0 left-0 h-32 w-32 select-none"
      style={{ touchAction: "none", WebkitTapHighlightColor: "transparent" }}
    />
  );
}

function Fade({ children }: { children: React.ReactNode }) {
  const reducedMotion = useReducedMotion();
  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reducedMotion ? 0 : 1 }}
      className="flex flex-col items-center leading-relaxed"
    >
      {children}
    </motion.div>
  );
}

/** Várias explosões espalhadas — o único momento exagerado do jogo. */
function StrongConfetti() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {CONFETTI_ORIGINS.map((origin) => (
        <ConfettiExplosion
          key={`${origin.x}-${origin.y}`}
          originXPercent={origin.x}
          originYPercent={origin.y}
        />
      ))}
    </div>
  );
}

/**
 * A barra que passou o jogo inteiro travando em 99% finalmente fecha.
 * O 100% aparece uma única vez, aqui.
 */
function FinalCompatibility() {
  const reducedMotion = useReducedMotion();
  const [value, setValue] = useState(99);

  useEffect(() => {
    const timer = window.setTimeout(() => setValue(100), pace(1400, reducedMotion));
    return () => window.clearTimeout(timer);
  }, [reducedMotion]);

  return (
    <div className="flex w-full max-w-xs flex-col items-center gap-3">
      <p className="font-mono text-xs tracking-[0.3em] text-neutral-500">
        COMPATIBILIDADE
      </p>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-800">
        <motion.div
          className="h-full rounded-full bg-neutral-100"
          animate={{ width: `${value}%` }}
          transition={{ duration: reducedMotion ? 0 : 1.1, ease: "easeOut" }}
        />
      </div>
      <motion.p
        key={value}
        initial={reducedMotion ? false : { opacity: 0.5 }}
        animate={{ opacity: 1 }}
        className="font-mono text-6xl font-bold tabular-nums text-neutral-50"
      >
        {value}%
      </motion.p>
    </div>
  );
}
