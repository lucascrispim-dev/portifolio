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

const HABILITADO: Achievement = {
  id: "habilitacao-emocional",
  title: "HABILITAÇÃO EMOCIONAL",
};

/**
 * EXAME DE HABILITAÇÃO EMOCIONAL — Era IV.
 *
 * A Era do Red é a Era do caos e do término, e a herdeira direta desse
 * disco é a Olivia Rodrigo — que estreou justamente cantando sobre tirar
 * a carteira de motorista. Daí o exame: cinco questões de trânsito
 * emocional, todas com resposta oficialmente errada.
 *
 * A graça é a burocracia. O sistema conduz o exame com a seriedade de um
 * Detran, reprova o candidato em todas as questões por motivos cada vez
 * menos defensáveis, e emite a habilitação assim mesmo — porque o
 * candidato é quem é.
 */

type Question = {
  prompt: string;
  options: { label: string; verdict: string }[];
};

const QUESTIONS: Question[] = [
  {
    prompt: "Você está dirigindo à noite\ne alguém liga.\nO que você faz?",
    options: [
      { label: "Atendo.", verdict: "INFRAÇÃO GRAVE." },
      { label: "Não atendo.", verdict: "INFRAÇÃO GRAVÍSSIMA." },
      { label: "Encosto e atendo.", verdict: "CORRETO. E mesmo assim: reprovado." },
    ],
  },
  {
    prompt: "Semáforo amarelo.\nVocê:",
    options: [
      { label: "Acelero.", verdict: "REPROVADO." },
      { label: "Paro.", verdict: "REPROVADO POR EXCESSO DE PRUDÊNCIA." },
      { label: "Fecho os olhos.", verdict: "REPROVADO, mas foi honesto." },
    ],
  },
  {
    prompt: "Você passa em frente\nà casa de alguém\nque não fala mais com você.",
    options: [
      { label: "Sigo em frente.", verdict: "MENTIRA DETECTADA." },
      { label: "Diminuo a velocidade.", verdict: "REGISTRADO. Sem comentários." },
      { label: "Dou a volta no quarteirão.", verdict: "REGISTRADO. Com comentários." },
    ],
  },
  {
    prompt: "Qual a distância segura\nentre você e a pessoa\nda frente?",
    options: [
      { label: "Dois segundos.", verdict: "INSUFICIENTE." },
      { label: "Dois metros.", verdict: "INSUFICIENTE." },
      { label: "Nenhuma.", verdict: "PERIGOSO. E é o que você faz." },
    ],
  },
  {
    prompt: "Última questão.\nVocê chegou ao destino.\nE agora?",
    options: [
      { label: "Desço.", verdict: "REPROVADO." },
      { label: "Fico mais um pouco no carro.", verdict: "REPROVADO. Todo mundo faz isso." },
      { label: "Depende de quem está do lado.", verdict: "REPROVADO. Mas essa foi bonita." },
    ],
  },
];

type Phase = "briefing" | "exam" | "verdict" | "issued";

export function DrivingTest({
  onDone,
  onAchievement,
  onPatienceDrop,
}: {
  onDone: () => void;
  onAchievement: (id: string) => void;
  onPatienceDrop: () => void;
}) {
  const theme = useEraTheme();
  const reducedMotion = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("briefing");
  const [index, setIndex] = useState(0);
  const [verdict, setVerdict] = useState<string | null>(null);
  const [briefingDone, setBriefingDone] = useState(false);
  const [issuedDone, setIssuedDone] = useState(false);

  const question = QUESTIONS[index];

  function answer(optionIndex: number) {
    playEffect("tap");
    setVerdict(question.options[optionIndex].verdict);
    setPhase("verdict");
  }

  function advance() {
    const next = index + 1;
    if (next >= QUESTIONS.length) {
      // Reprovado em todas as questões: a paciência paga por isso.
      onPatienceDrop();
      setPhase("issued");
      return;
    }
    setIndex(next);
    setVerdict(null);
    setPhase("exam");
  }

  return (
    <div className="flex flex-1 flex-col justify-center gap-6">
      <p className="font-mono text-[10px] tracking-[0.28em] opacity-60">
        EXAME DE HABILITAÇÃO EMOCIONAL
      </p>

      {phase === "briefing" ? (
        <div className="flex flex-col gap-5">
          <NarratorText
            lines={[
              { text: "Antes de continuar,", pause: "short" },
              { text: "preciso avaliar\nsua capacidade\nde dirigir sentimentos.", pause: "short" },
              { text: "São cinco questões.", pause: "short" },
              { text: "Nenhuma tem\nresposta certa.", pause: "long" },
            ]}
            onDone={() => setBriefingDone(true)}
          />
          {briefingDone ? (
            <ChoiceButton onClick={() => setPhase("exam")}>
              INICIAR EXAME
            </ChoiceButton>
          ) : null}
        </div>
      ) : null}

      {phase === "exam" ? (
        <div className="flex flex-col gap-5">
          <p className="font-mono text-xs tabular-nums opacity-50">
            QUESTÃO {index + 1} DE {QUESTIONS.length}
          </p>
          <p className="whitespace-pre-line text-[17px] leading-relaxed">
            {question.prompt}
          </p>
          <div className="flex flex-col gap-3">
            {question.options.map((option, optionIndex) => (
              <ChoiceButton
                key={option.label}
                variant="secondary"
                onClick={() => answer(optionIndex)}
              >
                {option.label}
              </ChoiceButton>
            ))}
          </div>
        </div>
      ) : null}

      {phase === "verdict" && verdict ? (
        <div className="flex flex-col gap-5">
          <motion.p
            initial={reducedMotion ? false : { opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            className="font-mono text-sm leading-relaxed tracking-[0.14em]"
            style={{ color: theme.accent }}
          >
            {verdict}
          </motion.p>
          <ChoiceButton onClick={advance}>
            {index + 1 >= QUESTIONS.length ? "VER RESULTADO" : "PRÓXIMA QUESTÃO"}
          </ChoiceButton>
        </div>
      ) : null}

      {phase === "issued" ? (
        <div className="flex flex-col gap-5">
          <SystemBlock
            lines={[
              "RESULTADO DO EXAME",
              "",
              "Questões: 5",
              "Acertos: 0",
              "Situação: REPROVADO",
              "",
              "Habilitação: EMITIDA",
            ]}
          />
          <NarratorText
            lines={[
              { text: "Você foi reprovado\nem todas as questões.", pause: "short" },
              {
                text: `Mas você é\n${projectConfig.playerTwoJokeName},`,
                pause: "short",
              },
              { text: "e ninguém aqui\nvai conseguir\nte impedir de dirigir.", pause: "long" },
            ]}
            onDone={() => setIssuedDone(true)}
          />
          {issuedDone ? (
            <>
              <AchievementCard achievement={HABILITADO} onUnlock={onAchievement} />
              <ChoiceButton onClick={onDone}>PEGAR A CHAVE</ChoiceButton>
            </>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
