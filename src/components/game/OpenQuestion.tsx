"use client";

import { useState } from "react";
import { ChoiceButton } from "@/components/game/ChoiceButton";
import { NarratorText } from "@/components/game/NarratorText";
import { useEraTheme } from "@/components/game/EraThemeProvider";
import type { EraScreen } from "@/types/game";

type OpenQuestionScreen = Extract<EraScreen, { kind: "openQuestion" }>;

/**
 * Pergunta de resposta livre. O que ele digita é guardado no progresso —
 * não para ser usado por nenhuma lógica, mas porque o Lucas vai querer
 * ler depois. O narrador nunca julga o conteúdo: ele só registra.
 */
export function OpenQuestion({
  screen,
  onAnswer,
  onContinue,
}: {
  screen: OpenQuestionScreen;
  onAnswer: (questionId: string, text: string) => void;
  onContinue: () => void;
}) {
  const theme = useEraTheme();
  const [value, setValue] = useState("");
  const [submitted, setSubmitted] = useState<string | null>(null);
  const [responseDone, setResponseDone] = useState(false);

  function submit() {
    const text = value.trim();
    if (!text) return;
    onAnswer(screen.questionId, text);
    setSubmitted(text);
  }

  return (
    <div className="flex flex-1 flex-col justify-center gap-6">
      {screen.label ? (
        <p className="font-mono text-xs tracking-[0.25em] opacity-70">
          {screen.label}
        </p>
      ) : null}

      <NarratorText lines={screen.prompt} />

      {submitted === null ? (
        <div className="flex flex-col gap-4">
          <label htmlFor={screen.questionId} className="sr-only">
            Sua resposta
          </label>
          <input
            id={screen.questionId}
            type="text"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") submit();
            }}
            maxLength={140}
            autoComplete="off"
            className="min-h-11 w-full border-b-2 bg-transparent px-1 py-2 text-[17px] outline-none focus-visible:outline-none"
            style={{ borderColor: theme.accent, color: theme.foreground }}
          />
          <ChoiceButton onClick={submit} disabled={!value.trim()}>
            {screen.submitLabel ?? "REGISTRAR"}
          </ChoiceButton>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {screen.echo ? (
            <p
              className="border-l-2 pl-3 font-mono text-sm italic"
              style={{ borderColor: theme.accent }}
            >
              “{submitted}”
            </p>
          ) : null}
          <NarratorText
            lines={screen.response}
            onDone={() => setResponseDone(true)}
          />
          {responseDone ? (
            <ChoiceButton onClick={onContinue}>
              {screen.cta ?? "CONTINUAR"}
            </ChoiceButton>
          ) : null}
        </div>
      )}
    </div>
  );
}
