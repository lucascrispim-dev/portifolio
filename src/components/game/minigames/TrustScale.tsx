"use client";

import { useState } from "react";
import { ChoiceButton } from "@/components/game/ChoiceButton";
import { NarratorText } from "@/components/game/NarratorText";
import { useEraTheme } from "@/components/game/EraThemeProvider";
import { playEffect } from "@/lib/audio";
import type { NarratorLine } from "@/types/game";

const PICKED_THIRTEEN: NarratorLine[] = [
  { text: "Boa escolha.", pause: "short" },
  { text: "O sistema não possui\ncomentários adicionais.", pause: "long" },
];

const PICKED_LESS: NarratorLine[] = [
  { text: "Resposta registrada.", pause: "short" },
  { text: "E observada.", pause: "short" },
  { text: "Com muita atenção.", pause: "long" },
];

/** Era VII — escala de 1 a 13, porque nada aqui vai até 10. */
export function TrustScale({ onDone }: { onDone: () => void }) {
  const theme = useEraTheme();
  const [picked, setPicked] = useState<number | null>(null);

  function choose(value: number) {
    if (picked !== null) return;
    playEffect("tap");
    setPicked(value);
  }

  return (
    <div className="flex flex-1 flex-col justify-center gap-6">
      <p className="text-[17px] leading-relaxed">
        Em uma escala de 1 a 13,
        <br />
        quanto você confia no Lucas?
      </p>

      <div className="grid grid-cols-5 gap-2">
        {Array.from({ length: 13 }, (_, index) => {
          const value = index + 1;
          const isPicked = picked === value;
          return (
            <button
              key={value}
              type="button"
              onClick={() => choose(value)}
              disabled={picked !== null}
              className="min-h-11 py-2 font-mono text-sm tabular-nums focus-visible:outline focus-visible:outline-2 disabled:cursor-default"
              style={{
                borderRadius: theme.radius,
                border: `1px solid ${isPicked ? theme.accent : `${theme.foreground}33`}`,
                backgroundColor: isPicked ? theme.accent : "transparent",
                color: isPicked ? theme.accentTextColor : theme.foreground,
                opacity: picked !== null && !isPicked ? 0.4 : 1,
              }}
            >
              {value}
            </button>
          );
        })}
      </div>

      {picked !== null ? (
        <div className="flex flex-col gap-5">
          <NarratorText lines={picked === 13 ? PICKED_THIRTEEN : PICKED_LESS} />
          <ChoiceButton onClick={onDone}>CONTINUAR</ChoiceButton>
        </div>
      ) : null}
    </div>
  );
}
