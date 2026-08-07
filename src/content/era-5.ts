import { eraThemes } from "@/config/themes";
import type { EraDefinition } from "@/types/game";

const ESPECIALISTA = {
  id: "especialista-em-lucas",
  title: "ESPECIALISTA EM LUCAS",
};

const OUT_OF_THE_WOODS = {
  id: "out-of-the-woods",
  title: "OUT OF THE WOODS",
};

const TRICOLOR = {
  id: "tricolor",
  title: "TRICOLOR",
};

/**
 * Era V — a mais longa e a mais cansativa de propósito: leite, um
 * labirinto que sempre volta ao começo e uma cobrança de pênalti que só
 * entra na terceira tentativa. É onde a paciência termina de acabar.
 */
export const era5: EraDefinition = {
  id: 5,
  code: "V",
  title: "1989",
  album: "1989",
  theme: eraThemes[5],
  achievements: [ESPECIALISTA, OUT_OF_THE_WOODS, TRICOLOR],
  screens: [
    {
      kind: "titleCard",
      id: "era5-title",
      eraLabel: "ERA V",
      title: "1989",
      tagline: [
        {
          text: "Bem-vindo\nà parte desnecessariamente\ncomplicada do projeto.",
          pause: "short",
        },
        { text: "Lucas faz TI.\nEra inevitável.", pause: "long" },
      ],
      cta: "CONTINUAR",
    },
    {
      kind: "quiz",
      id: "era5-leite",
      prompt: [{ text: "O que Lucas gosta de fazer\nquando passa mal?" }],
      options: [
        { id: "leite", label: "Tomar leite.", correct: true },
        { id: "remedio", label: "Tomar remédio." },
        { id: "dormir", label: "Dormir." },
        { id: "reclamar", label: "Reclamar dramaticamente." },
      ],
      onWrong: [{ text: "Não.\nPensa melhor." }],
      onCorrect: [
        { text: "Resposta correta.", pause: "short" },
        { text: "Não vou questionar\na lógica médica.", pause: "long" },
      ],
      achievement: ESPECIALISTA,
    },
    {
      kind: "quiz",
      id: "era5-leite-quantidade",
      prompt: [{ text: "Quanto leite?" }],
      options: [
        { id: "copo", label: "Um copo." },
        { id: "caixa", label: "Uma caixa." },
        { id: "muito", label: "Mais do que qualquer médico recomendaria." },
        { id: "nao-quero-saber", label: "Não quero mais falar sobre leite." },
      ],
      anyAnswerAccepted: true,
      onCorrect: [
        { text: "Resposta registrada.", pause: "short" },
        { text: "E preocupante.", pause: "long" },
      ],
    },
    { kind: "minigame", id: "era5-labirinto", game: "woodsLabyrinth" },
    {
      kind: "quiz",
      id: "era5-futebol",
      prompt: [
        { text: "Pergunta de segurança.", pause: "short" },
        { text: "Para qual time\nvocê torce?" },
      ],
      options: [
        { id: "spfc", label: "São Paulo Futebol Clube.", correct: true },
        { id: "corinthians", label: "Corinthians." },
        { id: "palmeiras", label: "Palmeiras." },
        { id: "nenhum", label: "Não gosto de futebol." },
      ],
      onWrong: [
        { text: "ERRO.", pause: "short" },
        {
          text: "Resposta incompatível\ncom ambiente de produção.",
          pause: "short",
        },
      ],
      onCorrect: [
        { text: "Resposta correta.", pause: "short" },
        { text: "Não havia alternativa.", pause: "long" },
      ],
    },
    { kind: "minigame", id: "era5-penalti", game: "penaltyShootout" },
    {
      kind: "quiz",
      id: "era5-eggs",
      prompt: [{ text: "Até agora,\nquantos Easter Eggs\nvocê encontrou?" }],
      options: [
        { id: "nenhum", label: "Nenhum." },
        { id: "alguns", label: "Alguns." },
        { id: "todos", label: "Todos." },
        { id: "nao-faco-ideia", label: "Não faço ideia." },
      ],
      anyAnswerAccepted: true,
      onCorrect: [
        { text: "Resposta registrada.", pause: "long" },
        { text: "E incorreta.", pause: "short" },
        { text: "Ainda faltam vários.", pause: "long" },
      ],
    },
    {
      kind: "eraOutro",
      id: "era5-outro",
      progressLabel: "60%",
      recalculatedLabel: "60%",
      recalculatedLines: [
        { text: "Nenhuma alteração.", pause: "short" },
        { text: "Estranho.", pause: "short" },
        { text: "Deve estar certo, então.", pause: "long" },
      ],
      lines: [{ text: "Ainda falta bastante.", pause: "long" }],
      cta: "PRÓXIMA ERA",
    },
  ],
};
