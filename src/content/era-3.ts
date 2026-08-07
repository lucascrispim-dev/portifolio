import { eraThemes } from "@/config/themes";
import type { EraDefinition } from "@/types/game";

const ENCHANTED = {
  id: "enchanted",
  title: "ENCHANTED",
  description: "Você tocou em treze estrelas. A décima terceira resistiu.",
};

/**
 * Era III — as perguntas ficam sinceras e a Era termina em desastre. É
 * aqui que o jogo entrega o celular para o Lucas escolher algo em
 * segredo e, logo depois, finge perder tudo (ERRO 13).
 */
export const era3: EraDefinition = {
  id: 3,
  code: "III",
  title: "Speak Now",
  album: "Speak Now",
  theme: eraThemes[3],
  achievements: [ENCHANTED],
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
      kind: "openQuestion",
      id: "era3-atencao",
      questionId: "primeira-atencao",
      label: "PERGUNTA ABERTA",
      prompt: [
        { text: "Chega de alternativas.", pause: "short" },
        { text: "O que chamou sua atenção\nno Lucas, no começo?", pause: "short" },
      ],
      echo: true,
      response: [
        { text: "Registrado.", pause: "short" },
        { text: "Ele não vai ver isso agora.", pause: "short" },
        { text: "Mas vai ver.", pause: "long" },
      ],
    },
    {
      kind: "openQuestion",
      id: "era3-percebeu",
      questionId: "quando-percebeu",
      label: "PERGUNTA ABERTA",
      prompt: [
        { text: "E quando você percebeu\nque isso tinha virado\noutra coisa?", pause: "short" },
      ],
      echo: true,
      response: [
        { text: "Interessante.", pause: "short" },
        { text: "Minhas anotações\ndizem outra data.", pause: "short" },
        { text: "Mas eu não discuto\ncom testemunha ocular.", pause: "long" },
      ],
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
    { kind: "minigame", id: "era3-entrega", game: "handToLucas" },
    // O troféu ENCHANTED é entregue pelo próprio minijogo, quando (e se)
    // a décima terceira estrela se deixa pegar.
    { kind: "minigame", id: "era3-estrelas", game: "enchantedStars" },
    // A Era III não tem desfecho: ela quebra.
    { kind: "erro13", id: "era3-erro13" },
  ],
};
