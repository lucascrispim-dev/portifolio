import { eraThemes } from "@/config/themes";
import { eraCompletionEvent } from "@/lib/events";
import { buildEventConfirmation, standardClosingLines } from "@/content/shared";
import type { EraDefinition } from "@/types/game";

export const era5: EraDefinition = {
  id: 5,
  code: "V",
  title: "1989",
  album: "1989",
  theme: eraThemes[5],
  completionEvent: eraCompletionEvent[5],
  badges: [{ id: "especialista-em-lucas", title: "Especialista em Lucas" }],
  eventConfirmation: buildEventConfirmation({
    question: [{ text: "Essa nova lembrança\njá aconteceu?" }],
    eventLabel: "NOVA LEMBRANÇA",
    registeredLines: [
      { text: "Registrado.", pause: "short" },
      { text: "A coleção cresce.", pause: "long" },
    ],
  }),
  screens: [
    {
      kind: "lines",
      id: "era5-abertura",
      lines: [
        { text: "Sincronizando novas memórias...", pause: "short" },
        { text: "Sincronização concluída.", pause: "long" },
      ],
      cta: "Continuar",
    },
    {
      kind: "titleCard",
      id: "era5-title",
      eraLabel: "ERA V",
      title: "1989",
      tagline:
        "Quanto mais observo...\nmais começo a acreditar que algumas pessoas simplesmente fazem sentido juntas.",
      cta: "Continuar",
    },
    {
      kind: "lines",
      id: "era5-intro",
      lines: [
        { text: "Antes de prosseguirmos...", pause: "short" },
        { text: "Preciso fazer uma última atualização no relatório.", pause: "long" },
        { text: "Prometo que vai ser rápido.", pause: "short" },
        { text: "(E talvez um pouco idiota.)", pause: "long" },
      ],
      cta: "Continuar",
    },
    {
      kind: "lines",
      id: "era5-diagnostico",
      lines: [
        { text: "Executando análise...", pause: "short" },
        {
          text: "✔ Muitas risadas.\n✔ Muitas piadas internas.\n✔ Quantidade elevada de Taylor Swift.\n✔ Memórias registradas.\n✔ Compatibilidade: 99%.",
          pause: "long",
        },
        {
          text: 'Aviso.\nExiste uma quantidade\npreocupante de "te amo, idiota". 😂',
          pause: "long",
        },
      ],
      cta: "Continuar",
    },
    {
      kind: "quiz",
      id: "era5-quiz-1",
      prompt: [
        { text: "Teste de memória." },
        { text: "O que o Lucas gosta de fazer\nquando passa mal?" },
      ],
      options: [
        { id: "leite", label: "🥛 Tomar leite.", correct: true },
        { id: "remedio", label: "💊 Tomar remédio." },
        { id: "dormir", label: "😴 Dormir." },
        { id: "chocolate", label: "🍫 Comer chocolate." },
      ],
      onWrong: [{ text: "Hmm...\nTem certeza?\nPensa melhor. 🙂" }],
      onCorrect: [
        { text: "Resposta correta.", pause: "short" },
        {
          text: "É curioso como pequenos detalhes\ndizem muito sobre alguém.",
          pause: "long",
        },
      ],
      badge: { id: "especialista-em-lucas", title: "Especialista em Lucas" },
    },
    {
      kind: "quiz",
      id: "era5-quiz-2",
      prompt: [
        { text: "Até agora..." },
        { text: "quantos Easter Eggs você acha\nque encontrou?" },
      ],
      options: [
        { id: "poucos", label: "Poucos." },
        { id: "bastantes", label: "Bastantes." },
        { id: "todos", label: "Todos." },
        { id: "nao-ideia", label: "Não faço ideia." },
      ],
      anyAnswerAccepted: true,
      onCorrect: [{ text: "Ainda faltam alguns... 👀" }],
    },
    {
      kind: "lines",
      id: "era5-comment",
      lines: [
        { text: "Confesso uma coisa.", pause: "short" },
        {
          text: "No começo eu achei\nque estava apenas organizando\nalgumas lembranças.",
          pause: "short",
        },
        { text: "Agora...\nacho que estou acompanhando\numa história.", pause: "long" },
      ],
      cta: "Continuar",
    },
    {
      kind: "compatibility",
      id: "era5-compatibility",
      lines: [
        { text: "Continuo sem entender\nesse último 1%.", pause: "short" },
        { text: "Isso está começando\na me incomodar.", pause: "long" },
      ],
    },
    {
      kind: "mission",
      id: "era5-mission",
      lines: [{ text: "Tenho mais um pedido.", pause: "long" }],
      missionLabel: "MISSÃO 05",
      missionLines: [
        "Criem mais uma lembrança.",
        "Não precisa ser perfeita.",
        "As melhores nunca são.",
      ],
      cta: "Pode deixar.",
      waitingLines: [
        { text: "Salvando capítulo...", pause: "short" },
        { text: "Capítulo salvo.", pause: "short" },
        { text: "Vou continuar escrevendo.", pause: "short" },
        {
          text: "Tenho a impressão\nde que estamos chegando\nperto do fim.",
          pause: "short",
        },
        { text: "Até já.", pause: "long" },
      ],
      waitingCta: "Fechar por enquanto",
    },
    {
      kind: "closing",
      id: "era5-closing",
      lines: standardClosingLines,
      cta: "Continuar para a Era VI",
    },
  ],
};
