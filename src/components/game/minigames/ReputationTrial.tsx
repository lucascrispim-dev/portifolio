"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AchievementCard } from "@/components/game/AchievementCard";
import { ChoiceButton } from "@/components/game/ChoiceButton";
import { NarratorText } from "@/components/game/NarratorText";
import { SystemBlock } from "@/components/game/SystemBlock";
import { useEraTheme } from "@/components/game/EraThemeProvider";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { projectConfig } from "@/config/project";
import { playEffect } from "@/lib/audio";
import type { Achievement } from "@/types/game";

const NO_BODY: Achievement = {
  id: "no-body-no-crime",
  title: "NO BODY, NO CRIME",
};

/**
 * O JULGAMENTO — Era VI.
 *
 * reputation é o disco sobre o que os outros dizem de você, então a Era
 * VI leva isso ao pé da letra: o sistema abre um processo. Cinco
 * acusações, todas verdadeiras, todas ridículas, e o réu só pode escolher
 * entre confessar e negar — as duas levando à mesma condenação.
 *
 * O narrador aqui não é o de sempre. Ele escreve em minúsculas, corta as
 * frases e não faz esforço nenhum para parecer imparcial. Ao final,
 * condena o réu e arquiva o processo, porque a acusação que interessava
 * nunca esteve na lista.
 */

const CHARGES: { text: string; guilty: string; innocent: string }[] = [
  {
    text: "acusação 1:\nfalar de Toy Story\nem contextos inadequados.",
    guilty: "confessado. anotado.",
    innocent: "negado. desconsiderado.",
  },
  {
    text: "acusação 2:\nrir da própria piada\nantes de terminar de contar.",
    guilty: "confessado. previsível.",
    innocent: "negado. existem provas em vídeo.",
  },
  {
    text: `acusação 3:\ndeixar ${projectConfig.playerOneName}\nfalando sozinho\nsobre um projeto\nque ele mesmo inventou.`,
    guilty: "confessado. compreensível.",
    innocent: "negado. e correto. ele fala demais.",
  },
  {
    text: "acusação 4:\naceitar termos de uso\nsem ler.",
    guilty: "confessado. reincidente.",
    innocent: "negado. o sistema estava assistindo.",
  },
  {
    text: "acusação 5:\nser insuportavelmente\nfácil de gostar.",
    guilty: "confessado.",
    innocent: "negado.\nnegado.\nnegado.",
  },
];

type Phase = "opening" | "charge" | "reaction" | "sentence";

export function ReputationTrial({
  onDone,
  onAchievement,
  onCollect,
}: {
  onDone: () => void;
  onAchievement: (id: string) => void;
  onCollect: (itemId: string) => void;
}) {
  const theme = useEraTheme();
  const reducedMotion = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("opening");
  const [index, setIndex] = useState(0);
  const [reaction, setReaction] = useState<string | null>(null);
  const [openingDone, setOpeningDone] = useState(false);
  const [sentenceDone, setSentenceDone] = useState(false);

  function plead(guilty: boolean) {
    playEffect("tap");
    const charge = CHARGES[index];
    setReaction(guilty ? charge.guilty : charge.innocent);
    setPhase("reaction");
  }

  function advance() {
    const next = index + 1;
    if (next >= CHARGES.length) {
      onCollect("recorte-de-jornal");
      setPhase("sentence");
      return;
    }
    setIndex(next);
    setReaction(null);
    setPhase("charge");
  }

  return (
    <div className="flex flex-1 flex-col justify-center gap-6">
      <p className="font-mono text-[10px] tracking-[0.28em] opacity-60">
        PROCESSO {new Date().getFullYear()}/13
      </p>

      {phase === "opening" ? (
        <div className="flex flex-col gap-5">
          <NarratorText
            lines={[
              { text: "algumas pessoas\nfalaram de vocês.", pause: "short" },
              { text: "eu anotei tudo.", pause: "short" },
              { text: "agora você\nvai responder.", pause: "long" },
            ]}
            onDone={() => setOpeningDone(true)}
          />
          {openingDone ? (
            <ChoiceButton onClick={() => setPhase("charge")}>
              ABRIR O PROCESSO
            </ChoiceButton>
          ) : null}
        </div>
      ) : null}

      {phase === "charge" ? (
        <div className="flex flex-col gap-5">
          <motion.p
            key={index}
            initial={reducedMotion ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="whitespace-pre-line text-[17px] leading-relaxed"
          >
            {CHARGES[index].text}
          </motion.p>
          <div className="flex flex-col gap-3">
            <ChoiceButton variant="secondary" onClick={() => plead(true)}>
              Culpado.
            </ChoiceButton>
            <ChoiceButton variant="secondary" onClick={() => plead(false)}>
              Inocente.
            </ChoiceButton>
          </div>
        </div>
      ) : null}

      {phase === "reaction" && reaction ? (
        <div className="flex flex-col gap-5">
          <p
            className="whitespace-pre-line font-mono text-sm leading-relaxed"
            style={{ color: theme.accent }}
          >
            {reaction}
          </p>
          <ChoiceButton onClick={advance}>
            {index + 1 >= CHARGES.length ? "OUVIR A SENTENÇA" : "PRÓXIMA ACUSAÇÃO"}
          </ChoiceButton>
        </div>
      ) : null}

      {phase === "sentence" ? (
        <div className="flex flex-col gap-5">
          <SystemBlock
            lines={[
              "SENTENÇA",
              "",
              "Réu: " + projectConfig.playerTwoJokeName,
              "Acusações: 5",
              "Condenações: 5",
              "",
              "Pena: continuar exatamente igual.",
            ]}
          />
          <NarratorText
            lines={[
              { text: "condenado em tudo.", pause: "short" },
              { text: "nada muda.", pause: "short" },
              {
                text: "a única acusação\nque me interessava\nnão estava na lista.",
                pause: "long",
              },
              { text: "não vou dizer qual.", pause: "long" },
            ]}
            onDone={() => setSentenceDone(true)}
          />
          {sentenceDone ? (
            <>
              <AchievementCard achievement={NO_BODY} onUnlock={onAchievement} />
              <ChoiceButton onClick={onDone}>ARQUIVAR O PROCESSO</ChoiceButton>
            </>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
