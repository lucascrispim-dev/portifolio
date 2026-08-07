import { eraThemes } from "@/config/themes";
import type { EraDefinition } from "@/types/game";

const FEARLESSLY_CURIOUS = {
  id: "fearlessly-curious",
  title: "FEARLESSLY CURIOUS",
};

/**
 * Era II — quatro perguntas de memória, todas sobre coisas pequenas
 * demais para alguém ter anotado. É onde o jogo estabelece que ele
 * sabe mais sobre vocês dois do que deveria.
 */
export const era2: EraDefinition = {
  id: 2,
  code: "II",
  title: "Fearless",
  album: "Fearless",
  theme: eraThemes[2],
  achievements: [FEARLESSLY_CURIOUS],
  screens: [
    {
      kind: "titleCard",
      id: "era2-title",
      eraLabel: "ERA II",
      title: "Fearless",
      tagline: [
        {
          text: "Toda boa história\ncomeça quando alguém\nconfia no desconhecido.",
          pause: "short",
        },
        { text: "Ou quando alguém\naceita termos de uso\nsem ler.", pause: "long" },
      ],
      cta: "CONTINUAR",
    },
    {
      kind: "quiz",
      id: "era2-filme",
      prompt: [{ text: "Qual filme marcou\na história de vocês?" }],
      options: [
        { id: "toy-story", label: "Toy Story.", correct: true },
        { id: "shrek", label: "Shrek." },
        { id: "carros", label: "Carros." },
        { id: "barbie", label: "Barbie." },
      ],
      onWrong: [{ text: "Não.\nPensa melhor." }],
      onCorrect: [
        { text: "Arquivo recuperado.", pause: "short" },
        { text: "Tecnicamente não foi hoje.", pause: "short" },
        { text: "Mas o sistema\ngostou da referência.", pause: "long" },
      ],
    },
    {
      kind: "quiz",
      id: "era2-villa-lobos",
      prompt: [{ text: "Onde vocês passaram\num dia inteiro\nsem fazer absolutamente nada?" }],
      options: [
        { id: "villa-lobos", label: "Villa-Lobos.", correct: true },
        { id: "ibirapuera", label: "Ibirapuera." },
        { id: "paulista", label: "Paulista." },
        { id: "casa", label: "Em casa, deitados." },
      ],
      onWrong: [{ text: "Errado.\nE eu estava lá." }],
      onCorrect: [
        { text: "Villa-Lobos confirmado.", pause: "short" },
        { text: "Grama, sol\ne nenhuma produtividade.", pause: "short" },
        { text: "Um dos melhores dias\nregistrados neste sistema.", pause: "long" },
      ],
    },
    {
      kind: "quiz",
      id: "era2-pizza",
      prompt: [{ text: "Qual comida aparece\nem quantidade estatisticamente\nsuspeita nesta relação?" }],
      options: [
        { id: "pizza", label: "Pizza.", correct: true },
        { id: "sushi", label: "Sushi." },
        { id: "hamburguer", label: "Hambúrguer." },
        { id: "salada", label: "Salada." },
      ],
      onWrong: [
        { text: "Não.", pause: "short" },
        { text: "E essa resposta\nchega a ofender.", pause: "short" },
      ],
      onCorrect: [
        { text: "Pizza.", pause: "short" },
        { text: "Sempre pizza.", pause: "short" },
        { text: "Conquista liberada\npor mérito questionável.", pause: "long" },
      ],
      achievement: FEARLESSLY_CURIOUS,
    },
    {
      kind: "quiz",
      id: "era2-toy-story-de-novo",
      prompt: [
        { text: "Última pergunta desta Era.", pause: "short" },
        { text: "Qual filme marcou\na história de vocês?" },
      ],
      options: [
        { id: "toy-story", label: "Toy Story.", correct: true },
        { id: "de-novo", label: "Você já perguntou isso." },
        { id: "serio", label: "Sério mesmo?" },
        { id: "toy-story-2", label: "Toy Story. De novo." },
      ],
      onWrong: [
        { text: "Eu sei.", pause: "short" },
        { text: "Responde assim mesmo.", pause: "short" },
      ],
      onCorrect: [
        { text: "Ótimo.", pause: "short" },
        { text: "Era só para confirmar\nque você presta atenção.", pause: "short" },
        { text: "Você presta.", pause: "long" },
      ],
    },
    { kind: "minigame", id: "era2-love-story", game: "loveStory" },
    {
      kind: "eraOutro",
      id: "era2-outro",
      // O golpe do contador: sobe para 73% e "recalcula" para 18%.
      progressLabel: "73%",
      recalculatedLabel: "18%",
      recalculatedLines: [
        { text: "Houve um engano.", pause: "short" },
        { text: "Não era 73%.", pause: "long" },
        { text: "A Era XIII\ncontinua muito longe.", pause: "long" },
      ],
      lines: [{ text: "Progresso atualizado.", pause: "short" }],
      cta: "PRÓXIMA ERA",
    },
  ],
};
