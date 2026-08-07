"use client";

import { useState } from "react";
import { AchievementCard } from "@/components/game/AchievementCard";
import { ChoiceButton } from "@/components/game/ChoiceButton";
import { NarratorText } from "@/components/game/NarratorText";
import type { EraScreen, NarratorLine } from "@/types/game";

type QuizScreen = Extract<EraScreen, { kind: "quiz" }>;

export function QuizCard({
  screen,
  onResolved,
}: {
  screen: QuizScreen;
  onResolved: (achievementId?: string) => void;
}) {
  const [promptDone, setPromptDone] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showWrong, setShowWrong] = useState(false);
  const [resolved, setResolved] = useState(false);
  const [responseLines, setResponseLines] = useState<NarratorLine[]>([]);

  function handleSelect(optionId: string) {
    const option = screen.options.find((o) => o.id === optionId);
    const isCorrect = screen.anyAnswerAccepted || option?.correct;

    setSelectedId(optionId);

    if (!isCorrect) {
      setShowWrong(true);
      return;
    }

    setShowWrong(false);
    // Uma alternativa pode ter resposta própria (ex.: "Enchanted"), que
    // substitui a fala padrão do acerto.
    setResponseLines(option?.response ?? screen.onCorrect);
    setResolved(true);
  }

  function tryAgain() {
    setShowWrong(false);
    setSelectedId(null);
  }

  return (
    <div className="flex flex-1 flex-col justify-center gap-6">
      <NarratorText lines={screen.prompt} onDone={() => setPromptDone(true)} />

      {promptDone && !resolved ? (
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

      {resolved ? (
        <div className="flex flex-col gap-5">
          <NarratorText lines={responseLines} />
          {screen.achievement ? (
            <AchievementCard achievement={screen.achievement} />
          ) : null}
          <ChoiceButton onClick={() => onResolved(screen.achievement?.id)}>
            {screen.cta ?? "CONTINUAR"}
          </ChoiceButton>
        </div>
      ) : null}
    </div>
  );
}
