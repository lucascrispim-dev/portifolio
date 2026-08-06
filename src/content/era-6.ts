import { eraThemes } from "@/config/themes";
import { eraCompletionEvent } from "@/lib/events";
import { buildEventConfirmation, standardClosingLines } from "@/content/shared";
import type { EraDefinition } from "@/types/game";

export const era6: EraDefinition = {
  id: 6,
  code: "VI",
  title: "reputation",
  album: "reputation",
  theme: eraThemes[6],
  completionEvent: eraCompletionEvent[6],
  badges: [{ id: "villa-lobos", title: "Villa-Lobos" }],
  eventConfirmation: buildEventConfirmation({
    question: [{ text: "Esse momento\njá aconteceu?" }],
    eventLabel: "MOMENTO PRIVADO",
    registeredLines: [
      { text: "Registrado.", pause: "short" },
      { text: "Algumas coisas\nnão precisam de plateia.", pause: "long" },
    ],
  }),
  screens: [
    {
      kind: "lines",
      id: "era6-abertura",
      lines: [
        { text: "Retomando manuscrito...", pause: "short" },
        { text: "Último capítulo carregado.", pause: "long" },
      ],
      cta: "Continuar",
    },
    {
      kind: "titleCard",
      id: "era6-title",
      eraLabel: "ERA VI",
      title: "reputation",
      tagline: "Algumas memórias mudam completamente uma história.",
      cta: "Continuar",
    },
    {
      kind: "lines",
      id: "era6-intro",
      lines: [
        { text: "Tenho uma lembrança\nque ainda não consegui entender.", pause: "long" },
        {
          text: "Na verdade...\nacho que estava guardando\nela para o momento certo.",
          pause: "long",
        },
      ],
      cta: "Continuar",
    },
    {
      kind: "reveal",
      id: "era6-villa-lobos",
      lines: [
        { text: "Foi aqui que aconteceu o primeiro beijo.", pause: "long" },
        { text: "Algumas lembranças não precisam de explicação.", pause: "long" },
        { text: "Elas explicam todo o resto." },
      ],
      badge: { id: "villa-lobos", title: "Villa-Lobos" },
    },
    {
      kind: "quiz",
      id: "era6-quiz-1",
      prompt: [
        { text: "Na sua opinião..." },
        { text: "algumas memórias mudam\na nossa vida?" },
      ],
      options: [
        { id: "sim", label: "Sim." },
        { id: "certeza", label: "Com certeza." },
        { id: "vivendo", label: "Ainda estou vivendo uma." },
      ],
      anyAnswerAccepted: true,
      onCorrect: [
        { text: "Resposta registrada.", pause: "short" },
        { text: "Ainda estou processando isso.", pause: "long" },
      ],
    },
    {
      kind: "compatibility",
      id: "era6-compatibility",
      lines: [
        { text: "Estranho...", pause: "short" },
        {
          text: "Depois dessa lembrança\neu tinha certeza\nde que chegaria a 100%.",
          pause: "long",
        },
        { text: "Mas ainda falta alguma coisa.", pause: "long" },
      ],
    },
    {
      kind: "lines",
      id: "era6-comment",
      lines: [
        { text: "Talvez...\neu tenha entendido errado.", pause: "long" },
        {
          text: "Talvez compatibilidade\nnão seja apenas\nsobre lembrar do passado.",
          pause: "long",
        },
        { text: "Talvez exista algo\nque ainda não aconteceu.", pause: "long" },
      ],
      cta: "Continuar",
    },
    {
      kind: "mission",
      id: "era6-mission",
      lines: [
        { text: "Antes de continuar...", pause: "short" },
        { text: "Tenho um pedido.", pause: "long" },
      ],
      missionLabel: "MISSÃO 06",
      missionLines: [
        "Guardem o celular\npor mais um momento.",
        "Existem lembranças\nque merecem\nacontecer sem testemunhas.",
      ],
      cta: "Até já.",
      waitingLines: [
        { text: "Escrevendo...", pause: "short" },
        {
          text: "Esse capítulo\nestá mais difícil\ndo que eu imaginava.",
          pause: "short",
        },
        { text: "Vou tentar novamente.\nAté daqui a pouco.", pause: "long" },
      ],
      waitingCta: "Fechar por enquanto",
    },
    {
      kind: "closing",
      id: "era6-closing",
      lines: standardClosingLines,
      cta: "Continuar para a Era VII",
    },
  ],
};
