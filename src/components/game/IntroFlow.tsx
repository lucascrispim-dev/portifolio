"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChoiceButton } from "@/components/game/ChoiceButton";
import { EscapingButton } from "@/components/game/EscapingButton";
import { LoadingSequence } from "@/components/game/LoadingSequence";
import { NarratorText } from "@/components/game/NarratorText";
import { SystemMessage } from "@/components/game/SystemMessage";
import { useEraTheme } from "@/components/game/EraThemeProvider";
import * as intro from "@/content/introduction";
import type { GameAction } from "@/lib/game-machine";
import type { GameProgress } from "@/types/game";

type Step =
  | "boot-lines"
  | "boot-title"
  | "classification-access"
  | "classification-loading"
  | "classification-result"
  | "invite"
  | "terms";

const NEXT_STEP: Partial<Record<Step, Step>> = {
  "boot-lines": "boot-title",
  "boot-title": "classification-access",
  "classification-access": "classification-loading",
  "classification-loading": "classification-result",
};

export function IntroFlow({
  progress,
  dispatch,
}: {
  progress: GameProgress;
  dispatch: (action: GameAction) => void;
}) {
  const theme = useEraTheme();
  const [step, setStep] = useState<Step>("boot-lines");
  const [inviteResolved, setInviteResolved] = useState(false);
  const [noButtonMessage, setNoButtonMessage] = useState<string | null>(null);
  const termsMountedAt = useRef(0);
  const [showFastClickWarning, setShowFastClickWarning] = useState(false);

  function goTo(next: Step | undefined) {
    if (next) setStep(next);
  }

  function handleAccept() {
    setInviteResolved(true);
  }

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
      {step === "boot-lines" ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
          <SystemMessage
            text={intro.bootLines.map((l) => l.text).join("\n\n")}
            className="whitespace-pre-line font-mono text-sm text-neutral-500"
            onDone={() => goTo(NEXT_STEP["boot-lines"])}
          />
        </div>
      ) : null}

      {step === "boot-title" ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            onAnimationComplete={() =>
              window.setTimeout(() => goTo(NEXT_STEP["boot-title"]), 900)
            }
            className="font-mono text-xl tracking-[0.15em] text-neutral-100"
          >
            {intro.bootTitle}
          </motion.p>
        </div>
      ) : null}

      {step === "classification-access" ? (
        <div className="flex flex-col gap-6">
          <p className="font-mono text-sm tracking-[0.2em] text-red-400">
            {intro.classificationHeader}
          </p>
          <NarratorText
            lines={intro.classificationAccessLines}
            onDone={() => goTo(NEXT_STEP["classification-access"])}
          />
        </div>
      ) : null}

      {step === "classification-loading" ? (
        <div className="flex flex-col gap-6">
          <p className="font-mono text-sm tracking-[0.2em] text-red-400">
            {intro.classificationHeader}
          </p>
          <LoadingSequence
            label={intro.classificationAnalyzing}
            onDone={() => goTo(NEXT_STEP["classification-loading"])}
          />
        </div>
      ) : null}

      {step === "classification-result" ? (
        <div className="flex flex-col gap-6">
          <NarratorText lines={intro.classificationResultLines} />
          <ChoiceButton onClick={() => setStep("invite")}>▶ PRESS START</ChoiceButton>
        </div>
      ) : null}

      {step === "invite" ? (
        <div className="relative flex flex-1 flex-col gap-8">
          <NarratorText lines={intro.inviteLines} />

          {!inviteResolved && !progress.noButtonDestroyed ? (
            <p
              aria-live="polite"
              className="min-h-[3em] text-sm opacity-80"
              style={{ color: theme.accent }}
            >
              {noButtonMessage ?? ""}
            </p>
          ) : null}

          {!inviteResolved && progress.noButtonDestroyed ? (
            <NarratorText lines={intro.noButtonExplodedLines} />
          ) : null}

          {!inviteResolved ? (
            <div className="relative min-h-[260px] flex-1">
              <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3">
                <ChoiceButton onClick={handleAccept}>Sim</ChoiceButton>
                <ChoiceButton variant="secondary" onClick={handleAccept}>
                  Sim também
                </ChoiceButton>
              </div>

              {!progress.noButtonDestroyed ? (
                <EscapingButton
                  initialAttempts={progress.noButtonAttempts}
                  onAttemptsChange={() => dispatch({ type: "NO_BUTTON_ATTEMPT" })}
                  onMessage={setNoButtonMessage}
                  onDestroyed={() => dispatch({ type: "NO_BUTTON_DESTROYED" })}
                />
              ) : null}
            </div>
          ) : (
            <NarratorText
              lines={intro.acceptedResponseLines}
              onDone={() => {
                termsMountedAt.current = Date.now();
                setStep("terms");
              }}
            />
          )}
        </div>
      ) : null}

      {step === "terms" ? (
        <div className="flex flex-1 flex-col gap-5">
          <p className="text-xs font-semibold tracking-[0.2em] opacity-70">
            TERMOS DE USO
          </p>
          <p className="text-[15px]">Ao iniciar este projeto, você concorda que:</p>
          <ul className="flex flex-col gap-2 text-sm leading-relaxed">
            {intro.termsItems.map((item) => (
              <li key={item} className="flex gap-2">
                <span aria-hidden>☑</span>
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
