"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChoiceButton } from "@/components/game/ChoiceButton";
import { EscapingButton } from "@/components/game/EscapingButton";
import { LoadingSequence } from "@/components/game/LoadingSequence";
import { NarratorText } from "@/components/game/NarratorText";
import { SystemBlock } from "@/components/game/SystemBlock";
import { SystemMessage } from "@/components/game/SystemMessage";
import { useEraTheme } from "@/components/game/EraThemeProvider";
import * as intro from "@/content/introduction";
import type { GameAction } from "@/lib/game-machine";
import type { GameProgress } from "@/types/game";

type Step =
  | "boot"
  | "title"
  | "classification"
  | "analyzing"
  | "result"
  | "invite"
  | "terms";

export function IntroFlow({
  progress,
  dispatch,
}: {
  progress: GameProgress;
  dispatch: (action: GameAction) => void;
}) {
  const theme = useEraTheme();
  const [step, setStep] = useState<Step>("boot");
  const [inviteAccepted, setInviteAccepted] = useState(false);
  const [noButtonMessage, setNoButtonMessage] = useState<string | null>(null);
  const termsMountedAt = useRef(0);
  const [showFastClickWarning, setShowFastClickWarning] = useState(false);

  function handleTermsClick() {
    const elapsed = Date.now() - termsMountedAt.current;
    if (elapsed < intro.TERMS_FAST_CLICK_THRESHOLD_MS && !showFastClickWarning) {
      setShowFastClickWarning(true);
      return;
    }
    dispatch({ type: "TERMS_ACCEPTED" });
  }

  return (
    <div className="flex flex-1 flex-col justify-center gap-6 px-6 py-10">
      {step === "boot" ? (
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <SystemMessage
            text={intro.bootLines.map((l) => l.text).join("\n\n")}
            className="whitespace-pre-line font-mono text-sm text-neutral-500"
            onDone={() => setStep("title")}
          />
        </div>
      ) : null}

      {step === "title" ? (
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            onAnimationComplete={() =>
              window.setTimeout(() => setStep("classification"), 900)
            }
            className="font-mono text-xl tracking-[0.15em] text-neutral-100"
          >
            {intro.bootTitle}
          </motion.p>
        </div>
      ) : null}

      {step === "classification" ? (
        <div className="flex flex-col gap-6">
          <p className="whitespace-pre-line font-mono text-sm tracking-[0.2em] text-red-400">
            {intro.classificationHeader}
          </p>
          <SystemBlock lines={intro.classificationBlock} />
          <ChoiceButton onClick={() => setStep("analyzing")}>CONTINUAR</ChoiceButton>
        </div>
      ) : null}

      {step === "analyzing" ? (
        <div className="flex flex-col gap-6">
          <p className="whitespace-pre-line font-mono text-sm tracking-[0.2em] text-red-400">
            {intro.classificationHeader}
          </p>
          <LoadingSequence
            label={intro.classificationAnalyzing}
            onDone={() => setStep("result")}
          />
        </div>
      ) : null}

      {step === "result" ? (
        <div className="flex flex-col gap-6">
          <SystemBlock lines={intro.classificationResultBlock} />
          <ChoiceButton onClick={() => setStep("invite")}>PRESS START</ChoiceButton>
        </div>
      ) : null}

      {step === "invite" ? (
        <div className="relative flex flex-1 flex-col gap-8">
          <NarratorText lines={intro.inviteLines} />

          {!inviteAccepted && !progress.noButtonDestroyed ? (
            <p
              aria-live="polite"
              className="min-h-[4em] whitespace-pre-line text-sm opacity-80"
              style={{ color: theme.accent }}
            >
              {noButtonMessage ?? ""}
            </p>
          ) : null}

          {!inviteAccepted && progress.noButtonDestroyed ? (
            <NarratorText lines={intro.noButtonExplodedLines} />
          ) : null}

          {!inviteAccepted ? (
            <div className="relative min-h-[260px] flex-1">
              <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3">
                <ChoiceButton onClick={() => setInviteAccepted(true)}>Sim.</ChoiceButton>
                <ChoiceButton
                  variant="secondary"
                  onClick={() => setInviteAccepted(true)}
                >
                  Sim também.
                </ChoiceButton>
              </div>

              {!progress.noButtonDestroyed ? (
                <EscapingButton
                  label="Não."
                  initialAttempts={progress.noButtonAttempts}
                  onAttemptsChange={() => dispatch({ type: "NO_BUTTON_ATTEMPT" })}
                  onMessage={setNoButtonMessage}
                  onDestroyed={() => dispatch({ type: "NO_BUTTON_DESTROYED" })}
                />
              ) : null}
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              <ChoiceButton
                onClick={() => {
                  termsMountedAt.current = Date.now();
                  setStep("terms");
                }}
              >
                CONTINUAR
              </ChoiceButton>
            </div>
          )}
        </div>
      ) : null}

      {step === "terms" ? (
        <div className="flex flex-1 flex-col gap-5">
          <p className="font-mono text-xs font-semibold tracking-[0.25em] opacity-70">
            TERMOS DE USO
          </p>
          <p className="text-[15px]">Ao iniciar este projeto, você concorda que:</p>
          <ul className="flex flex-col gap-2 text-sm leading-relaxed">
            {intro.termsItems.map((item) => (
              <li key={item} className="flex gap-2">
                <span aria-hidden style={{ color: theme.accent }}>
                  —
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          {showFastClickWarning ? (
            <NarratorText lines={intro.termsFastClickLines} />
          ) : null}
          <ChoiceButton onClick={handleTermsClick}>
            Li absolutamente tudo.
          </ChoiceButton>
        </div>
      ) : null}
    </div>
  );
}
