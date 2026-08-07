"use client";

import { useState } from "react";
import { ChoiceButton } from "@/components/game/ChoiceButton";
import { NarratorText } from "@/components/game/NarratorText";
import { useEraTheme } from "@/components/game/EraThemeProvider";

/**
 * O texto digitado aqui é guardado no progresso e reaparece na Era VIII
 * (easter egg "Blank Space"), então o jogador vê a própria frase voltar
 * muito depois de tê-la escrito.
 */
export function BlankSpaceInput({
  onSubmit,
  onDone,
}: {
  onSubmit: (text: string) => void;
  onDone: () => void;
}) {
  const theme = useEraTheme();
  const [value, setValue] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit() {
    const text = value.trim();
    if (!text) return;
    onSubmit(text);
    setSubmitted(true);
  }

  return (
    <div className="flex flex-1 flex-col justify-center gap-6">
      <div className="flex flex-col gap-1">
        <p className="font-mono text-xs tracking-[0.25em] opacity-70">
          ESPAÇO EM BRANCO
        </p>
        <p className="text-[15px] opacity-90">Digite qualquer coisa.</p>
      </div>

      {!submitted ? (
        <div className="flex flex-col gap-4">
          <label htmlFor="blank-space" className="sr-only">
            Espaço em branco
          </label>
          <input
            id="blank-space"
            type="text"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") handleSubmit();
            }}
            maxLength={120}
            autoComplete="off"
            className="min-h-11 w-full border-b-2 bg-transparent px-1 py-2 text-[17px] outline-none focus-visible:outline-none"
            style={{ borderColor: theme.accent, color: theme.foreground }}
          />
          <ChoiceButton onClick={handleSubmit} disabled={!value.trim()}>
            REGISTRAR
          </ChoiceButton>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          <p
            className="border-l-2 pl-3 font-mono text-sm italic"
            style={{ borderColor: theme.accent }}
          >
            “{value.trim()}”
          </p>
          <NarratorText
            lines={[
              { text: "Interessante.", pause: "short" },
              {
                text: "Lucas provavelmente\nnão esperava essa resposta.",
                pause: "long",
              },
            ]}
          />
          <ChoiceButton onClick={onDone}>CONTINUAR</ChoiceButton>
        </div>
      )}
    </div>
  );
}
