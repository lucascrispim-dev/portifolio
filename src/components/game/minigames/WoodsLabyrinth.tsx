"use client";

import { useState } from "react";
import { AchievementCard } from "@/components/game/AchievementCard";
import { ChoiceButton } from "@/components/game/ChoiceButton";
import { NarratorText } from "@/components/game/NarratorText";
import { useEraTheme } from "@/components/game/EraThemeProvider";
import { playEffect } from "@/lib/audio";
import type { Achievement } from "@/types/game";

const OUT_OF_THE_WOODS: Achievement = {
  id: "out-of-the-woods",
  title: "OUT OF THE WOODS",
};

type NodeId = "start" | "left" | "right" | "deep" | "almost" | "badIdea" | "exit";

type MazeNode = {
  prompt: string;
  options: { label: string; goTo: NodeId; message?: string }[];
};

/**
 * Era V — labirinto que trapaceia. Uma rota anuncia a saída e volta duas
 * telas; outra é a piada da Olivia Rodrigo e devolve ao começo. Só a
 * terceira insistência leva de fato para fora.
 */
const MAZE: Record<NodeId, MazeNode> = {
  start: {
    prompt: "Você entrou na mata.",
    options: [
      { label: "Seguir à esquerda", goTo: "left" },
      { label: "Seguir à direita", goTo: "right" },
    ],
  },
  left: {
    prompt: "Tudo parece igual.",
    options: [
      { label: "Continuar", goTo: "almost" },
      { label: "Voltar", goTo: "start", message: "Você voltou ao começo." },
    ],
  },
  right: {
    prompt: "Mais fundo.",
    options: [
      { label: "Insistir", goTo: "deep" },
      { label: "BAD IDEA RIGHT?", goTo: "badIdea" },
    ],
  },
  deep: {
    prompt: "Você não faz ideia de onde está.",
    options: [
      { label: "Seguir a luz", goTo: "almost" },
      { label: "Voltar", goTo: "start", message: "Você voltou ao começo." },
    ],
  },
  almost: {
    prompt: "VOCÊ CHEGOU.",
    options: [
      {
        label: "Sair",
        goTo: "start",
        message: "Brincadeira.\nVocê voltou duas telas.",
      },
      { label: "Desconfiar", goTo: "exit" },
    ],
  },
  badIdea: {
    prompt: "Foi uma bad idea, right?",
    options: [
      { label: "Recomeçar", goTo: "start", message: "Você voltou ao começo." },
    ],
  },
  exit: {
    prompt: "Are we out of the woods?",
    options: [{ label: "Sim", goTo: "exit" }],
  },
};

export function WoodsLabyrinth({
  onDone,
  onAchievement,
  onPatienceDrop,
}: {
  onDone: () => void;
  onAchievement: (id: string) => void;
  onPatienceDrop: () => void;
}) {
  const theme = useEraTheme();
  const [node, setNode] = useState<NodeId>("start");
  const [message, setMessage] = useState<string | null>(null);
  const [backtracks, setBacktracks] = useState(0);

  const current = MAZE[node];
  const escaped = node === "exit";

  function choose(option: MazeNode["options"][number]) {
    if (option.message) {
      playEffect("escape");
      const next = backtracks + 1;
      setBacktracks(next);
      if (next === 1) onPatienceDrop();
      setMessage(option.message);
    } else {
      playEffect("tap");
      setMessage(null);
    }
    setNode(option.goTo);
  }

  if (escaped) {
    return (
      <div className="flex flex-1 flex-col justify-center gap-5">
        <NarratorText
          lines={[
            { text: "Are we out of the woods?", pause: "short" },
            { text: "Sim.", pause: "long" },
          ]}
        />
        <AchievementCard achievement={OUT_OF_THE_WOODS} onUnlock={onAchievement} />
        <ChoiceButton onClick={onDone}>CONTINUAR</ChoiceButton>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col justify-center gap-6">
      <p className="font-mono text-xs tracking-[0.25em] opacity-70">
        OUT OF THE WOODS
      </p>

      <p className="text-[17px] leading-relaxed">{current.prompt}</p>

      {message ? (
        <p
          aria-live="polite"
          className="whitespace-pre-line text-sm italic"
          style={{ color: theme.accent }}
        >
          {message}
        </p>
      ) : null}

      <div className="flex flex-col gap-3">
        {current.options.map((option) => (
          <ChoiceButton
            key={option.label}
            variant="secondary"
            onClick={() => choose(option)}
          >
            {option.label}
          </ChoiceButton>
        ))}
      </div>
    </div>
  );
}
