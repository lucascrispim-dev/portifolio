import { eraThemes } from "@/config/themes";
import type { EraDefinition } from "@/types/game";

const ENCHANTED = {
  id: "enchanted",
  title: "ENCHANTED",
  description: "Você tocou em treze estrelas. A décima terceira resistiu.",
};

/**
 * Era III — Speak Now.
 *
 * O sistema **fala demais**. Essa é a personalidade da Era, e ela existe
 * por um motivo estrutural: é aqui que a Era XIII entra no jogo, e ela
 * precisa entrar por acidente.
 *
 * A sequência é deliberada. Primeiro as perguntas ficam sinceras e o
 * narrador começa a comentar coisas que não lhe foram pedidas. Então ele
 * se trai, censura a frase tarde demais e manda o jogador ignorar. Logo
 * depois, o mapa — que até agora tinha doze Eras — ganha um décimo
 * terceiro cartão classificado, sem uma palavra de explicação.
 *
 * E aí a Era não termina: ela quebra (ERRO 13).
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
    // O vazamento. É o único lugar do jogo em que a Era XIII é revelada.
    { kind: "leak", id: "era3-vazamento" },
    // E o mapa logo em seguida, para ele conferir com os próprios olhos
    // que apareceu uma linha que não estava lá.
    { kind: "progressMap", id: "era3-mapa", cta: "FECHAR O MAPA" },
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
      // O sistema trava justamente na resposta mais sincera da Era. A
      // desculpa que ele dá — "resposta boa demais" — é o elogio mais
      // desajeitado que ele consegue fazer.
      kind: "interrupt",
      id: "era3-erro-08",
      error: "erro-08",
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
