import { eraThemes } from "@/config/themes";
import { eraCompletionEvent } from "@/lib/events";
import { buildEventConfirmation, standardClosingLines } from "@/content/shared";
import type { EraDefinition } from "@/types/game";

export const era3: EraDefinition = {
  id: 3,
  code: "III",
  title: "Speak Now",
  album: "Speak Now",
  theme: eraThemes[3],
  completionEvent: eraCompletionEvent[3],
  badges: [
    { id: "the-movie-night", title: "The Movie Night" },
    { id: "certified-swiftie", title: "Certified Swiftie" },
    { id: "lucky-number", title: "Lucky Number" },
  ],
  eventConfirmation: buildEventConfirmation({
    question: [{ text: "O filme\njá aconteceu?" }],
    eventLabel: "EXPERIÊNCIA DE CINEMA",
    registeredLines: [
      { text: "História atualizada.", pause: "short" },
      { text: "Valeu a pena, pelo visto.", pause: "long" },
    ],
  }),
  screens: [
    {
      kind: "lines",
      id: "era3-abertura",
      lines: [
        { text: "Recuperando capítulo...", pause: "short" },
        { text: "Capítulo encontrado.", pause: "short" },
        { text: "Revisando algumas lembranças...", pause: "long" },
      ],
      cta: "Continuar",
    },
    {
      kind: "titleCard",
      id: "era3-title",
      eraLabel: "ERA III",
      title: "Speak Now",
      tagline: "Algumas histórias são assistidas.\nOutras... são vividas.",
      cta: "Continuar",
      titleTapEasterEgg: {
        tapsRequired: 13,
        badge: { id: "lucky-number", title: "Lucky Number" },
        message:
          "Eu estava curioso para saber quanto tempo você demoraria para descobrir isso.",
      },
    },
    {
      kind: "lines",
      id: "era3-intro",
      lines: [
        { text: "Acho que estou começando a entender vocês.", pause: "short" },
        { text: "Ainda tenho algumas dúvidas.", pause: "long" },
      ],
      cta: "Continuar",
    },
    {
      kind: "quiz",
      id: "era3-quiz-1",
      prompt: [
        {
          text: "Qual destes momentos fez Lucas perceber\nque essa história poderia ser diferente?",
        },
      ],
      options: [
        { id: "pizza", label: "A pizza" },
        { id: "toy-story", label: "Toy Story", correct: true },
        { id: "beijo", label: "O primeiro beijo" },
        { id: "taylor", label: "Taylor Swift" },
      ],
      onWrong: [{ text: "Hmm...\nTem certeza?\nPensa melhor. 🙂" }],
      onCorrect: [
        { text: "Curioso...", pause: "short" },
        {
          text: "Às vezes uma grande mudança\ncomeça no momento mais comum.",
          pause: "long",
        },
      ],
      badge: { id: "the-movie-night", title: "The Movie Night" },
    },
    {
      kind: "quiz",
      id: "era3-quiz-2",
      prompt: [{ text: "Qual destes assuntos aparece com mais frequência?" }],
      options: [
        { id: "taylor-1", label: "Taylor Swift" },
        { id: "taylor-2", label: "Taylor Swift" },
        { id: "taylor-3", label: "Taylor Swift" },
        { id: "sim", label: "Sim 😂" },
      ],
      anyAnswerAccepted: true,
      onCorrect: [
        { text: "Banco de dados atualizado.", pause: "short" },
        { text: "Confirmado.", pause: "short" },
        { text: "A Taylor realmente participa desta história.", pause: "long" },
      ],
      badge: { id: "certified-swiftie", title: "Certified Swiftie" },
    },
    {
      kind: "quiz",
      id: "era3-quiz-3",
      prompt: [{ text: "Você acredita em destino?" }],
      options: [
        { id: "sim", label: "Sim" },
        { id: "talvez", label: "Talvez" },
        { id: "nao-ideia", label: "Não faço ideia" },
        { id: "vivendo", label: "Prefiro descobrir vivendo" },
      ],
      anyAnswerAccepted: true,
      onCorrect: [
        { text: "Resposta registrada.", pause: "short" },
        { text: "Ainda estou analisando.", pause: "long" },
      ],
    },
    {
      kind: "lines",
      id: "era3-comment",
      lines: [
        { text: "Estou começando a perceber um padrão.", pause: "short" },
        { text: "Vocês riem bastante.", pause: "short" },
        { text: "Vocês conversam bastante.", pause: "short" },
        {
          text: "E parecem transformar qualquer lugar\nem uma boa lembrança.",
          pause: "short",
        },
        { text: "Interessante...", pause: "long" },
      ],
      cta: "Continuar",
    },
    {
      kind: "mission",
      id: "era3-mission",
      lines: [
        { text: "Antes de eu continuar...", pause: "short" },
        { text: "Tenho um último pedido.", pause: "long" },
      ],
      missionLabel: "MISSÃO 03",
      missionLines: [
        "Quando as luzes apagarem...",
        "Esqueça que eu existo.",
        "Aproveite o filme.",
        "Depois me conte se valeu a pena.",
      ],
      cta: "Combinado.",
      waitingLines: [
        { text: "Registrando novas lembranças...", pause: "short" },
        { text: "História atualizada.", pause: "short" },
        { text: "Vou escrever mais um pouco.\nAté depois do filme.", pause: "long" },
      ],
      waitingCta: "Fechar por enquanto",
    },
    {
      kind: "closing",
      id: "era3-closing",
      lines: standardClosingLines,
      cta: "Continuar para a Era IV",
    },
  ],
};
