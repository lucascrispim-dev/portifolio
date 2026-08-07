import { eraThemes } from "@/config/themes";
import type { EraDefinition } from "@/types/game";

export const era6: EraDefinition = {
  id: 6,
  code: "VI",
  title: "reputation",
  album: "reputation",
  theme: eraThemes[6],
  achievements: [{ id: "clean", title: "CLEAN", description: "Hidratação restaurada." }],
  screens: [
    {
      kind: "titleCard",
      id: "era6-title",
      eraLabel: "ERA VI",
      title: "reputation",
      tagline: [
        {
          text: "Existem histórias\nque parecem simples\npara quem observa de fora.",
          pause: "short",
        },
        { text: "Esta não é uma delas.", pause: "long" },
      ],
      cta: "CONTINUAR",
    },
    {
      kind: "reveal",
      id: "era6-villa-lobos",
      systemBlock: ["ARQUIVO LOCALIZADO", "VILLA-LOBOS", "", "Evento: Primeiro beijo."],
      lines: [
        { text: "Algumas memórias\nnão precisam de explicação.", pause: "long" },
        { text: "Elas explicam\ntodo o resto.", pause: "long" },
      ],
      cta: "CONTINUAR",
    },
    {
      kind: "quiz",
      id: "era6-descricao",
      prompt: [{ text: "Qual destas opções\ndescreve melhor vocês?" }],
      options: [
        { id: "king", label: "King of My Heart." },
        { id: "end-game", label: "End Game." },
        { id: "delicate", label: "Delicate." },
        { id: "todas", label: "Um pouco de todas." },
      ],
      anyAnswerAccepted: true,
      onCorrect: [
        { text: "Resposta registrada.", pause: "short" },
        { text: "Ainda estou processando isso.", pause: "long" },
      ],
    },
    {
      kind: "compatibility",
      id: "era6-compatibilidade",
      label: "RECALCULANDO",
      lines: [
        { text: "Nem o primeiro beijo\nresolveu aquele 1%.", pause: "short" },
        {
          text: "A Era XIII\nestá se tornando\nestatisticamente suspeita.",
          pause: "long",
        },
      ],
    },
    { kind: "minigame", id: "era6-mijao", game: "waterCup" },
    {
      kind: "eraOutro",
      id: "era6-outro",
      progressLabel: "6 de 13",
      lines: [
        {
          text: "Eu chamaria\nde uma situação\ncada vez mais suspeita.",
          pause: "long",
        },
      ],
      cta: "PRÓXIMA ERA",
    },
  ],
};
