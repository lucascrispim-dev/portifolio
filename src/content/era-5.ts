import { eraThemes } from "@/config/themes";
import type { EraDefinition } from "@/types/game";

const ESPECIALISTA = {
  id: "especialista-em-lucas",
  title: "ESPECIALISTA EM LUCAS",
};

export const era5: EraDefinition = {
  id: 5,
  code: "V",
  title: "1989",
  album: "1989",
  theme: eraThemes[5],
  achievements: [ESPECIALISTA],
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
      id: "era5-eggs",
      prompt: [
        { text: "Até agora,\nquantos Easter Eggs\nvocê encontrou?" },
      ],
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
      kind: "quiz",
      id: "era5-hoje",
      prompt: [{ text: "O que provavelmente\nacontecerá hoje?" }],
      options: [
        { id: "inesperado", label: "Algo inesperado." },
        { id: "taylor", label: "Taylor Swift será mencionada novamente." },
        { id: "supra", label: "Iremos ao Supra." },
        { id: "todas", label: "Todas as alternativas.", correct: true },
      ],
      onWrong: [{ text: "Incompleto.\nPensa maior." }],
      onCorrect: [
        { text: "Previsão registrada.", pause: "short" },
        {
          text: "O sistema não fornecerá\ndetalhes adicionais.",
          pause: "long",
        },
      ],
    },
    {
      kind: "quiz",
      id: "era5-risco",
      prompt: [{ text: "Qual é o maior risco\ndeste projeto?" }],
      options: [
        { id: "travar", label: "O site travar." },
        { id: "roteiro", label: "Lucas esquecer o roteiro." },
        { id: "final", label: "Você descobrir o final." },
        {
          id: "leite",
          label: "Faltar leite.",
          response: [{ text: "Risco crítico identificado.", pause: "long" }],
        },
      ],
      anyAnswerAccepted: true,
      onCorrect: [{ text: "Risco registrado.", pause: "long" }],
    },
    { kind: "minigame", id: "era5-blank-space", game: "blankSpace" },
    {
      kind: "eraOutro",
      id: "era5-outro",
      progressLabel: "38,46%",
      lines: [{ text: "Ainda falta bastante.", pause: "long" }],
      cta: "PRÓXIMA ERA",
    },
  ],
};
