import { eraThemes } from "@/config/themes";
import type { EraDefinition } from "@/types/game";

export const era2: EraDefinition = {
  id: 2,
  code: "II",
  title: "Fearless",
  album: "Fearless",
  theme: eraThemes[2],
  achievements: [{ id: "fearlessly-curious", title: "FEARLESSLY CURIOUS" }],
  screens: [
    {
      kind: "titleCard",
      id: "era2-title",
      eraLabel: "ERA II",
      title: "Fearless",
      tagline: [
        {
          text: "Toda boa história\ncomeça quando alguém\nconfia no desconhecido.",
          pause: "short",
        },
        { text: "Ou quando alguém\naceita termos de uso\nsem ler.", pause: "long" },
      ],
      cta: "CONTINUAR",
    },
    {
      kind: "quiz",
      id: "era2-filme",
      prompt: [{ text: "Qual filme marcou\na história de vocês?" }],
      options: [
        { id: "toy-story", label: "Toy Story.", correct: true },
        { id: "shrek", label: "Shrek." },
        { id: "carros", label: "Carros." },
        { id: "barbie", label: "Barbie." },
      ],
      onWrong: [{ text: "Não.\nPensa melhor." }],
      onCorrect: [
        { text: "Arquivo recuperado:\nToday Was a Fairytale", pause: "short" },
        { text: "Tecnicamente não foi hoje.", pause: "short" },
        { text: "Mas o sistema\ngostou da referência.", pause: "long" },
      ],
    },
    {
      kind: "quiz",
      id: "era2-musicas",
      prompt: [{ text: "Quem manda mais músicas\nda Taylor Swift?" }],
      options: [
        { id: "lucas-1", label: "Lucas." },
        { id: "lucas-2", label: "Lucas." },
        { id: "lucas-3", label: "Lucas." },
        { id: "todas", label: "Todas as anteriores." },
      ],
      anyAnswerAccepted: true,
      onCorrect: [
        { text: "Diagnóstico confirmado.", pause: "short" },
        { text: "Lucas não envia músicas.", pause: "short" },
        {
          text: "Lucas administra\numa distribuidora\nnão autorizada\nde Taylor Swift.",
          pause: "long",
        },
      ],
    },
    { kind: "minigame", id: "era2-nao-toque", game: "noTouchButton" },
    {
      kind: "eraOutro",
      id: "era2-outro",
      progressLabel: "2 de 13",
      lines: [{ text: "A Era XIII\ncontinua muito longe.", pause: "long" }],
      cta: "PRÓXIMA ERA",
    },
  ],
};
