import { eraThemes } from "@/config/themes";
import { eraCompletionEvent } from "@/lib/events";
import { buildEventConfirmation, standardClosingLines } from "@/content/shared";
import type { EraDefinition } from "@/types/game";

export const era4: EraDefinition = {
  id: 4,
  code: "IV",
  title: "Red",
  album: "Red",
  theme: eraThemes[4],
  completionEvent: eraCompletionEvent[4],
  badges: [
    { id: "little-things", title: "Little Things" },
    { id: "pizza-professional", title: "Pizza Professional" },
    {
      id: "confidential-information",
      title: "Confidential Information",
      description: "Algumas informações realmente devem permanecer em sigilo.",
    },
  ],
  eventConfirmation: buildEventConfirmation({
    question: [{ text: "Essa conversa\njá aconteceu?" }],
    eventLabel: "CONVERSA",
    registeredLines: [
      { text: "Registrado.", pause: "short" },
      { text: "Cada conversa\nconta um pouco mais.", pause: "long" },
    ],
  }),
  screens: [
    {
      kind: "lines",
      id: "era4-abertura",
      lines: [
        { text: "Recuperando capítulo...", pause: "short" },
        { text: "Capítulo encontrado.", pause: "short" },
        { text: "Revisando algumas anotações...", pause: "long" },
      ],
      cta: "Continuar",
    },
    {
      kind: "titleCard",
      id: "era4-title",
      eraLabel: "ERA IV",
      title: "Red",
      tagline:
        "Algumas histórias não mudam por causa de grandes acontecimentos.\nElas mudam por causa de pequenos momentos.",
      cta: "Continuar",
    },
    {
      kind: "lines",
      id: "era4-intro",
      lines: [
        { text: "Enquanto vocês estavam vivendo...", pause: "short" },
        { text: "Eu fiquei pensando.", pause: "long" },
        { text: "Talvez eu estivesse procurando\nas lembranças erradas.", pause: "long" },
        {
          text: "As melhores histórias\nraramente acontecem\nnos grandes momentos.",
          pause: "short",
        },
        { text: "Quase sempre acontecem\nnos pequenos.", pause: "long" },
      ],
      cta: "Continuar",
    },
    {
      kind: "reveal",
      id: "era4-little-things",
      lines: [
        { text: "Começo a acreditar que vocês colecionam momentos simples." },
      ],
      badge: { id: "little-things", title: "Little Things" },
    },
    {
      kind: "quiz",
      id: "era4-quiz-1",
      prompt: [
        { text: "Complete a frase." },
        { text: "Uma boa noite quase sempre fica melhor com..." },
      ],
      options: [
        { id: "pizza", label: "🍕 Pizza", correct: true },
        { id: "sushi", label: "🍣 Sushi" },
        { id: "hamburguer", label: "🍔 Hambúrguer" },
        { id: "salada", label: "🥗 Salada" },
      ],
      onWrong: [{ text: "Hmm...\nTem certeza?\nPensa melhor. 🙂" }],
      onCorrect: [
        { text: "Hipótese confirmada.", pause: "short" },
        {
          text: "A pizza realmente ocupa\num espaço importante nesta história.",
          pause: "long",
        },
      ],
      badge: { id: "pizza-professional", title: "Pizza Professional" },
    },
    {
      kind: "quiz",
      id: "era4-quiz-2",
      prompt: [
        { text: "Ainda existe uma informação\nque não consegui confirmar.", pause: "long" },
        { text: "Quem costuma perder a linha primeiro?" },
      ],
      options: [
        { id: "lucas", label: "Lucas" },
        { id: "eu", label: "Eu" },
        { id: "depende", label: "Depende do assunto." },
        { id: "lgpd", label: "Informação protegida pela LGPD." },
      ],
      anyAnswerAccepted: true,
      onCorrect: [
        { text: "Consultando arquivos...", pause: "short" },
        { text: "Hmm...", pause: "short" },
        { text: "Melhor deixar isso\nentre vocês. 🙂", pause: "long" },
      ],
      badge: {
        id: "confidential-information",
        title: "Confidential Information",
        description: "Algumas informações realmente devem permanecer em sigilo.",
      },
    },
    {
      kind: "compatibility",
      id: "era4-compatibility",
      lines: [
        { text: "Ainda existe 1%\nque não consigo calcular.", pause: "short" },
        { text: "Talvez eu descubra\nmais tarde.", pause: "long" },
      ],
    },
    {
      kind: "lines",
      id: "era4-comment",
      lines: [
        { text: "Estou começando\na entender vocês.", pause: "long" },
        { text: "Não são os lugares.", pause: "short" },
        { text: "Não são os presentes.", pause: "short" },
        { text: "Nem os planos.", pause: "short" },
        { text: "São as pequenas coisas.", pause: "long" },
        { text: "Talvez esse\nsempre tenha sido\no segredo.", pause: "long" },
      ],
      cta: "Continuar",
    },
    {
      kind: "mission",
      id: "era4-mission",
      lines: [{ text: "Tenho só mais um pedido.", pause: "long" }],
      missionLabel: "MISSÃO 04",
      missionLines: [
        "Conversem.",
        "Sobre qualquer assunto.",
        "Não precisa ser profundo.",
        "As melhores conversas\nraramente são planejadas.",
      ],
      cta: "Fechado.",
      waitingLines: [
        { text: "Atualizando manuscrito...", pause: "short" },
        { text: "Capítulo salvo.", pause: "short" },
        { text: "Estou quase entendendo\nessa história.", pause: "short" },
        { text: "Vou continuar escrevendo.\nAté daqui a pouco.", pause: "long" },
      ],
      waitingCta: "Fechar por enquanto",
    },
    {
      kind: "closing",
      id: "era4-closing",
      lines: standardClosingLines,
      cta: "Continuar para a Era V",
    },
  ],
};
