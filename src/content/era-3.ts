import { eraThemes } from "@/config/themes";
import type { EraDefinition } from "@/types/game";

export const era3: EraDefinition = {
  id: 3,
  code: "III",
  title: "Speak Now",
  album: "Speak Now",
  theme: eraThemes[3],
  achievements: [
    {
      id: "enchanted",
      title: "ENCHANTED",
      description: "Você tocou em treze estrelas. Taylor aprovaria.",
    },
  ],
  screens: [
    {
      kind: "titleCard",
      id: "era3-title",
      eraLabel: "ERA III",
      title: "Speak Now",
      tagline: [
        { text: "Algumas histórias\nsão assistidas.\nOutras são vividas.", pause: "short" },
        {
          text: "E algumas precisam\nde um sistema inteiro\npara fazer perguntas invasivas.",
          pause: "long",
        },
      ],
      cta: "CONTINUAR",
    },
    {
      kind: "quiz",
      id: "era3-momento",
      prompt: [
        {
          text: "Qual momento fez Lucas perceber\nque esta história\npoderia ser diferente?",
        },
      ],
      options: [
        { id: "pizza", label: "A pizza." },
        { id: "toy-story", label: "Assistir Toy Story juntos.", correct: true },
        { id: "beijo", label: "O primeiro beijo." },
        { id: "taylor", label: "Taylor Swift." },
      ],
      onWrong: [{ text: "Não.\nPensa melhor." }],
      onCorrect: [
        { text: "Registrado.", pause: "short" },
        {
          text: "Às vezes uma grande mudança\ncomeça no momento mais comum.",
          pause: "long",
        },
      ],
    },
    {
      kind: "quiz",
      id: "era3-descricao",
      prompt: [{ text: "Como você descreveria\naquele momento?" }],
      options: [
        { id: "simples", label: "Simples." },
        { id: "importante", label: "Importante." },
        { id: "inesperado", label: "Inesperado." },
        {
          id: "enchanted",
          label: "Enchanted.",
          response: [
            { text: "Referência detectada.", pause: "short" },
            { text: "Nota:\n13 de 10.", pause: "long" },
          ],
        },
      ],
      anyAnswerAccepted: true,
      onCorrect: [{ text: "Resposta registrada.", pause: "long" }],
    },
    {
      kind: "quiz",
      id: "era3-lucas",
      prompt: [{ text: "O Lucas é:" }],
      options: [
        { id: "dramatico", label: "Dramático." },
        { id: "engracado", label: "Engraçado." },
        { id: "bonito", label: "Bonito." },
        { id: "todas", label: "Todas as anteriores, infelizmente." },
      ],
      anyAnswerAccepted: true,
      onCorrect: [
        { text: "Resposta aceita.", pause: "short" },
        {
          text: "Embora exista\numa alternativa claramente superior.",
          pause: "long",
        },
      ],
    },
    { kind: "minigame", id: "era3-estrelas", game: "starCursor" },
    {
      kind: "eraOutro",
      id: "era3-outro",
      progressLabel: "3 de 13",
      lines: [
        { text: "Era concluída.", pause: "short" },
        { text: "Ainda não é o final.", pause: "short" },
        { text: "Nem perto.", pause: "long" },
      ],
      cta: "PRÓXIMA ERA",
    },
  ],
};
