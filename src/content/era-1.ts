import { eraThemes } from "@/config/themes";
import type { EraDefinition } from "@/types/game";

const BEGIN_AGAIN = {
  id: "begin-again",
  title: "BEGIN AGAIN",
  description:
    "Você concluiu uma Era sem saber absolutamente nada sobre o prêmio.",
};

export const era1: EraDefinition = {
  id: 1,
  code: "I",
  title: "Begin Again",
  album: "Taylor Swift",
  theme: eraThemes[1],
  achievements: [BEGIN_AGAIN],
  screens: [
    // O mapa das 13 Eras abre o jogo: é ele que planta a ideia de que
    // ainda faltam cinco Eras depois da folklore.
    { kind: "progressMap", id: "mapa-inicial", cta: "COMEÇAR" },
    {
      kind: "titleCard",
      id: "era1-title",
      eraLabel: "ERA I",
      title: "Begin Again",
      tagline: [
        { text: "Toda história\nprecisa começar\nem algum lugar.", pause: "short" },
        {
          text: "Esta começou\ncom você apertando\num botão que claramente\nnão deveria apertar.",
          pause: "long",
        },
      ],
      cta: "CONTINUAR",
    },
    {
      kind: "quiz",
      id: "era1-paciencia",
      prompt: [{ text: "Você costuma ser paciente?" }],
      options: [
        { id: "sim", label: "Sim." },
        { id: "as-vezes", label: "Às vezes." },
        { id: "nunca", label: "Nunca." },
        { id: "irritando", label: "Essa pergunta já está me irritando." },
      ],
      anyAnswerAccepted: true,
      onCorrect: [
        { text: "Informação registrada.", pause: "short" },
        { text: "Paciência:\nDELUXE EDITION INDISPONÍVEL", pause: "long" },
      ],
    },
    { kind: "minigame", id: "era1-our-song", game: "wordSearch" },
    {
      kind: "reveal",
      id: "era1-achievement",
      lines: [],
      achievement: BEGIN_AGAIN,
    },
    {
      kind: "eraOutro",
      id: "era1-outro",
      progressLabel: "1 de 13",
      lines: [
        { text: "Falta pouco.", pause: "long" },
        { text: "Isso foi mentira.", pause: "long" },
      ],
      cta: "CONTINUAR",
    },
  ],
};
