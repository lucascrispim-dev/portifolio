import { eraThemes } from "@/config/themes";
import type { EraDefinition } from "@/types/game";

const DEBUT = {
  id: "debut",
  title: "DEBUT",
  description:
    "Você concluiu uma Era sem saber absolutamente nada sobre o prêmio.",
};

/**
 * Era I — estabelece as três regras do jogo em menos de cinco minutos:
 * o narrador pergunta coisas, não aceita as respostas, e o progresso
 * exibido não tem relação nenhuma com a realidade.
 */
export const era1: EraDefinition = {
  id: 1,
  code: "I",
  title: "Debut",
  album: "Taylor Swift",
  theme: eraThemes[1],
  achievements: [DEBUT],
  screens: [
    // O mapa abre o jogo: é ele que planta a ideia de que existem treze
    // Eras, quatro delas ilegíveis e uma classificada.
    { kind: "progressMap", id: "mapa-inicial", cta: "COMEÇAR" },
    {
      kind: "titleCard",
      id: "era1-title",
      eraLabel: "ERA I",
      title: "Debut",
      tagline: [
        { text: "Toda história\nprecisa começar\nem algum lugar.", pause: "short" },
        {
          text: "Esta começou\ncom você apertando\num botão que claramente\nnão deveria apertar.",
          pause: "long",
        },
      ],
      cta: "CONTINUAR",
    },
    { kind: "minigame", id: "era1-nome", game: "nameChallenge" },
    {
      kind: "quiz",
      id: "era1-paciencia",
      prompt: [{ text: "Você costuma ser paciente?" }],
      options: [
        { id: "sim", label: "Sim." },
        { id: "as-vezes", label: "Às vezes." },
        { id: "nunca", label: "Nunca." },
        { id: "irritando", label: "Essa pergunta já está me irritando." },
      ],
      anyAnswerAccepted: true,
      onCorrect: [
        { text: "Informação registrada.", pause: "short" },
        { text: "Vamos testar isso.", pause: "long" },
      ],
    },
    { kind: "minigame", id: "era1-escala", game: "trustScale" },
    { kind: "minigame", id: "era1-our-song", game: "ourSong" },
    {
      kind: "reveal",
      id: "era1-achievement",
      lines: [],
      achievement: DEBUT,
    },
    {
      kind: "eraOutro",
      id: "era1-outro",
      // Primeira mentira do contador: 8% vira 41% sem nenhum motivo.
      progressLabel: "8%",
      recalculatedLabel: "41%",
      recalculatedLines: [
        { text: "Melhor assim.", pause: "short" },
        { text: "Falta pouco.", pause: "long" },
        { text: "Isso foi mentira.", pause: "long" },
      ],
      lines: [{ text: "Progresso registrado.", pause: "short" }],
      cta: "CONTINUAR",
    },
  ],
};
