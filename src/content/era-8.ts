import { eraThemes } from "@/config/themes";
import type { EraDefinition } from "@/types/game";

/**
 * A Era VIII precisa parecer uma etapa de organização e análise — nunca
 * um encerramento. O jogador deve sair dela acreditando que o jogo será
 * apenas pausado até as Eras IX a XIII existirem.
 */
export const era8: EraDefinition = {
  id: 8,
  code: "VIII",
  title: "folklore",
  album: "folklore",
  theme: eraThemes[8],
  achievements: [{ id: "invisible-string", title: "INVISIBLE STRING" }],
  screens: [
    {
      kind: "titleCard",
      id: "era8-title",
      eraLabel: "ERA VIII",
      title: "folklore",
      tagline: [
        { text: "Toda história possui\nversões que são contadas.", pause: "short" },
        { text: "E versões\nque permanecem escondidas.", pause: "long" },
      ],
      cta: "CONTINUAR",
    },
    { kind: "minigame", id: "era8-arquivos", game: "fileCards" },
    {
      kind: "quiz",
      id: "era8-representa",
      prompt: [{ text: "Qual destes arquivos\nmais representa vocês?" }],
      options: [
        { id: "toy-story", label: "TOY STORY" },
        { id: "pizza", label: "PIZZA" },
        { id: "villa-lobos", label: "VILLA-LOBOS" },
        { id: "te-amo", label: "TE AMO, IDIOTA" },
      ],
      anyAnswerAccepted: true,
      onCorrect: [
        { text: "Escolha registrada.", pause: "short" },
        { text: "Provavelmente incorreta.", pause: "long" },
        { text: "Brincadeira.", pause: "long" },
      ],
    },
    {
      kind: "quiz",
      id: "era8-lucas-escolheria",
      prompt: [{ text: "Qual destes arquivos\nLucas escolheria?" }],
      options: [
        { id: "toy-story", label: "TOY STORY" },
        { id: "taylor", label: "TAYLOR SWIFT" },
        { id: "villa-lobos", label: "VILLA-LOBOS" },
        { id: "leite", label: "TOMAR LEITE" },
      ],
      anyAnswerAccepted: true,
      onCorrect: [
        { text: "Interessante.", pause: "short" },
        { text: "Vamos descobrir\nse você o conhece mesmo.", pause: "long" },
      ],
    },
    {
      kind: "quiz",
      id: "era8-creditos",
      prompt: [
        { text: "Qual música\ndeveria tocar\nnos créditos desta história?" },
      ],
      options: [
        { id: "invisible-string", label: "invisible string" },
        { id: "daylight", label: "Daylight" },
        { id: "enchanted", label: "Enchanted" },
        { id: "long-live", label: "Long Live" },
      ],
      anyAnswerAccepted: true,
      onCorrect: [{ text: "Anotado para o final.", pause: "long" }],
    },
    {
      kind: "quiz",
      id: "era8-espera",
      prompt: [{ text: "O que você espera\nencontrar na Era XIII?" }],
      options: [
        { id: "premio", label: "O prêmio." },
        { id: "pergunta", label: "Uma pergunta." },
        { id: "surpresa", label: "Uma surpresa." },
        { id: "capitulo", label: "Um capítulo novo." },
        { id: "nao-faco-ideia", label: "Não faço ideia." },
      ],
      anyAnswerAccepted: true,
      onCorrect: [
        { text: "Previsão registrada.", pause: "short" },
        { text: "Você terá de esperar.", pause: "long" },
      ],
    },
    {
      kind: "compatibility",
      id: "era8-compatibilidade",
      label: "COMPATIBILIDADE",
      theOneEasterEgg: true,
      footerBlock: ["Estimativa de conclusão:", "ERA XIII"],
      lines: [
        {
          text: "O último 1%\nserá analisado\nno próximo capítulo.",
          pause: "long",
        },
      ],
    },
    { kind: "saveAndEnd", id: "era8-encerrar" },
  ],
};
