import { eraThemes } from "@/config/themes";
import { eraCompletionEvent } from "@/lib/events";
import { buildEventConfirmation, standardClosingLines } from "@/content/shared";
import type { EraDefinition } from "@/types/game";

export const era2: EraDefinition = {
  id: 2,
  code: "II",
  title: "Fearless",
  album: "Fearless",
  theme: eraThemes[2],
  completionEvent: eraCompletionEvent[2],
  badges: [
    { id: "toy-story", title: "Toy Story", description: "Memória registrada." },
    {
      id: "swiftie-survivor",
      title: "Swiftie Survivor",
      description: "Existe uma quantidade preocupante de Taylor Swift nesta relação.",
    },
  ],
  eventConfirmation: buildEventConfirmation({
    question: [{ text: "Esse momento\njá aconteceu?" }],
    eventLabel: "MOMENTO COMPARTILHADO",
    registeredLines: [
      { text: "Memórias sincronizadas.", pause: "short" },
      { text: "Mais uma peça\nno lugar certo.", pause: "long" },
    ],
  }),
  screens: [
    {
      kind: "lines",
      id: "era2-abertura",
      lines: [
        { text: "...", pause: "short" },
        { text: "Continuando a escrever...", pause: "short" },
        { text: "Capítulo atualizado.", pause: "long" },
      ],
      cta: "Continuar",
    },
    {
      kind: "titleCard",
      id: "era2-title",
      eraLabel: "ERA II",
      title: "Fearless",
      tagline:
        "Toda boa história começa quando alguém resolve confiar no desconhecido.",
      cta: "Continuar",
    },
    {
      kind: "lines",
      id: "era2-intro",
      lines: [
        { text: "Antes de continuar...", pause: "short" },
        { text: "Preciso confirmar algumas informações.", pause: "short" },
        { text: "Meu banco de dados ainda está sendo atualizado.", pause: "long" },
      ],
      cta: "Continuar",
    },
    {
      kind: "quiz",
      id: "era2-quiz-1",
      prompt: [{ text: "Qual foi o filme que marcou a história de vocês?" }],
      options: [
        { id: "toy-story", label: "Toy Story", correct: true },
        { id: "shrek", label: "Shrek" },
        { id: "carros", label: "Carros" },
        { id: "barbie", label: "Barbie" },
      ],
      onWrong: [{ text: "Hmm...\nTem certeza?\nPensa melhor. 🙂" }],
      onCorrect: [
        { text: "Memória registrada.", pause: "short" },
        { text: "Interessante...", pause: "short" },
        { text: "Às vezes um filme é só um filme.", pause: "short" },
        {
          text: "Às vezes ele muda completamente\na forma como alguém enxerga outra pessoa.",
          pause: "long",
        },
      ],
      badge: { id: "toy-story", title: "Toy Story", description: "Memória registrada." },
    },
    {
      kind: "quiz",
      id: "era2-quiz-2",
      prompt: [{ text: "Quem manda mais músicas da Taylor Swift?" }],
      options: [
        { id: "lucas-1", label: "Lucas" },
        { id: "lucas-2", label: "Lucas" },
        { id: "lucas-3", label: "Lucas" },
        { id: "todas", label: "Todas as alternativas acima" },
      ],
      anyAnswerAccepted: true,
      onCorrect: [
        { text: "Diagnóstico atualizado.", pause: "short" },
        {
          text: "Existe uma quantidade preocupante\nde Taylor Swift nesta relação.",
          pause: "long",
        },
      ],
      badge: {
        id: "swiftie-survivor",
        title: "Swiftie Survivor",
        description: "Existe uma quantidade preocupante de Taylor Swift nesta relação.",
      },
    },
    {
      kind: "quiz",
      id: "era2-quiz-3",
      prompt: [{ text: 'Quem fala mais "te amo, idiota"?' }],
      options: [
        { id: "lucas", label: "Lucas" },
        { id: "eu", label: "Eu" },
        { id: "os-dois", label: "Os dois" },
        { id: "confidencial", label: "Isso é informação confidencial" },
      ],
      anyAnswerAccepted: true,
      onCorrect: [
        { text: "Resposta aceita.", pause: "short" },
        { text: "Não existe resposta errada para essa pergunta.", pause: "long" },
      ],
    },
    {
      kind: "lines",
      id: "era2-comment",
      lines: [
        { text: "Hipótese atualizada.", pause: "short" },
        {
          text: "Vocês parecem transformar\npequenas coisas em boas lembranças.",
          pause: "short",
        },
        { text: "Talvez seja esse o segredo.", pause: "long" },
      ],
      cta: "Continuar",
    },
    {
      kind: "mission",
      id: "era2-mission",
      lines: [{ text: "Tenho um favor para pedir.", pause: "long" }],
      missionLabel: "MISSÃO 02",
      missionLines: [
        "Guardem o celular por um tempo.",
        "Criem uma lembrança.",
        "Depois eu continuo escrevendo.",
      ],
      cta: "Prometo.",
      waitingLines: [
        { text: "Salvando progresso...", pause: "short" },
        { text: "Memórias sincronizadas.", pause: "short" },
        { text: "Vou escrever mais um pouco.\nAté já.", pause: "long" },
      ],
      waitingCta: "Fechar por enquanto",
    },
    {
      kind: "closing",
      id: "era2-closing",
      lines: standardClosingLines,
      cta: "Continuar para a Era III",
    },
  ],
};
