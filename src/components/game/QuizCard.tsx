"use client";

import { useState } from "react";
import { ChoiceButton } from "@/components/game/ChoiceButton";
import { NarratorText } from "@/components/game/NarratorText";
import { BadgeCard } from "@/components/game/BadgeCard";
import type { EraScreen } from "@/types/game";

type QuizScreen = Extract<EraScreen, { kind: "quiz" }>;

export function QuizCard({
  screen,
  onResolved,
}: {
  screen: QuizScreen;
  onResolved: (badgeId?: string) => void;
}) {
  const [promptDone, setPromptDone] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showWrong, setShowWrong] = useState(false);
  const [showCorrect, setShowCorrect] = useState(false);

  function handleSelect(optionId: string) {
    setSelectedId(optionId);
    const option = screen.options.find((o) => o.id === optionId);
    const isCorrect = screen.anyAnswerAccepted || option?.correct;

    if (isCorrect) {
      setShowCorrect(true);
      setShowWrong(false);
    } else {
      setShowWrong(true);
    }
  }

  function tryAgain() {
    setShowWrong(false);
    setSelectedId(null);
  }

  return (
    <div className="flex flex-col gap-6">
      <NarratorText lines={screen.prompt} onDone={() => setPromptDone(true)} />

      {promptDone && !showCorrect ? (
        <div className="flex flex-col gap-3">
          {screen.options.map((option) => (
            <ChoiceButton
              key={option.id}
              variant={selectedId === option.id ? "primary" : "secondary"}
              onClick={() => handleSelect(option.id)}
            >
              {option.label}
            </ChoiceButton>
          ))}
        </div>
      ) : null}

      {showWrong ? (
        <div className="flex flex-col gap-3">
          <NarratorText lines={screen.onWrong ?? []} />
          <ChoiceButton variant="ghost" onClick={tryAgain}>
            Pensar de novo
          </ChoiceButton>
        </div>
      ) : null}

      {showCorrect ? (
        <div className="flex flex-col gap-4">
          <NarratorText lines={screen.onCorrect} />
          {screen.badge ? <BadgeCard badge={screen.badge} /> : null}
          <ChoiceButton onClick={() => onResolved(screen.badge?.id)}>
            Continuar
          </ChoiceButton>
        </div>
      ) : null}
    </div>
  );
}
