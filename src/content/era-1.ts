import { eraThemes } from "@/config/themes";
import { eraCompletionEvent } from "@/lib/events";
import type { EraDefinition } from "@/types/game";

export const era1: EraDefinition = {
  id: 1,
  code: "I",
  title: "Begin Again",
  album: "Taylor Swift (Debut)",
  theme: eraThemes[1],
  completionEvent: eraCompletionEvent[1],
  badges: [
    {
      id: "begin-again",
      title: "BEGIN AGAIN",
      description:
        "Você criou uma lembrança antes mesmo de saber onde essa história vai terminar.",
    },
  ],
  eventConfirmation: {
    reopenLines: [
      { text: "Você voltou.", pause: "long" },
      { text: "Mais cedo\ndo que eu esperava...", pause: "short" },
      { text: "Ou talvez não.", pause: "long" },
    ],
    question: [{ text: "Uma nova lembrança\njá aconteceu?" }],
    notYetResponse: [
      { text: "Tudo bem.", pause: "short" },
      { text: "Boas histórias\nnão precisam ser apressadas.", pause: "short" },
      { text: "Volte quando tiver\nalgo novo para me contar.", pause: "long" },
    ],
    confirmQuestion: "Tem certeza?",
    maybeResponse: [
      { text: "Então ainda não terminou.\nVolte quando tiver certeza." },
    ],
    doubtResponse: [
      {
        text: "Excelente.\nConsegui confundir você\ncom uma única pergunta.\nTente novamente depois.",
      },
    ],
    certainResponse: [{ text: "Resposta registrada." }],
    analyzingLabel: "Analisando acontecimento...",
    eventLabel: "NOVA LEMBRANÇA",
    registeredLines: [
      { text: "Interessante...", pause: "short" },
      { text: "A história mudou\nenquanto eu não estava olhando.", pause: "short" },
      { text: "Acho que era exatamente\ndisso que eu precisava.", pause: "long" },
    ],
  },
  screens: [
    {
      kind: "titleCard",
      id: "era1-title",
      eraLabel: "ERA I",
      title: "Begin Again",
      tagline: "Toda história precisa de um primeiro acontecimento.",
      cta: "Começar Era",
    },
    {
      kind: "mission",
      id: "era1-mission",
      lines: [
        { text: "Antes de continuar...", pause: "long" },
        { text: "Preciso de uma coisa\nque ainda não existe.", pause: "long" },
        { text: "Uma lembrança nova.", pause: "long" },
      ],
      missionLabel: "MISSÃO 01",
      missionLines: [
        "Feche este aplicativo.",
        "Aproveite o momento.",
        "Criem uma lembrança.",
        "Não precisa ser perfeita.",
        "Só precisa ser de vocês.",
      ],
      cta: "Entendido",
      waitingLines: [
        { text: "Missão iniciada.", pause: "short" },
        { text: "Agora a próxima parte\nacontece fora da tela.", pause: "short" },
        { text: "Até daqui a pouco. 👋", pause: "long" },
      ],
      waitingCta: "Fechar por enquanto",
    },
    {
      kind: "reveal",
      id: "era1-badge",
      lines: [
        {
          text: "Evento concluído:\nPrimeira lembrança do projeto.",
          pause: "long",
        },
      ],
      badge: {
        id: "begin-again",
        title: "BEGIN AGAIN",
        description:
          "Você criou uma lembrança antes mesmo de saber onde essa história vai terminar.",
      },
    },
    {
      kind: "closing",
      id: "era1-closing",
      lines: [
        { text: "Agora eu tenho\nmaterial suficiente.", pause: "short" },
        { text: "Vou continuar escrevendo.", pause: "short" },
        { text: "Não espia.", pause: "long" },
        { text: "Salvando acontecimento...", pause: "short" },
        { text: "Acontecimento salvo.", pause: "short" },
        { text: "A próxima Era\njá pode começar.", pause: "long" },
      ],
      cta: "Continuar para a Era II",
    },
  ],
};
