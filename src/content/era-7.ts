import { eraThemes } from "@/config/themes";
import { projectConfig } from "@/config/project";
import type { EraDefinition } from "@/types/game";

/**
 * Era VII — Lover.
 *
 * O sistema fica **gentil**. Elogia, se preocupa, oferece ajuda, promete
 * pegar leve — e continua exatamente tão sabotador quanto antes, só que
 * sorrindo. O modo se chama "SIMPÁTICO*", e o asterisco nunca é
 * explicado até a Era decidir explicá-lo.
 *
 * Estruturalmente, a Era VII não pode parecer o final. É a mais leve e
 * colorida do jogo — sem despedidas, sem preparação para o pedido, sem
 * falar em decisão final. O único conteúdo pesado é um minijogo em que
 * quatro anéis se recusam a colaborar.
 */
export const era7: EraDefinition = {
  id: 7,
  code: "VII",
  title: "Lover",
  album: "Lover",
  theme: eraThemes[7],
  achievements: [{ id: "paper-rings", title: "PAPER RINGS" }],
  screens: [
    {
      kind: "titleCard",
      id: "era7-title",
      eraLabel: "ERA VII",
      title: "Lover",
      tagline: [
        {
          text: "Você chegou\nà Era com o nome\nmais suspeito\ndeste projeto.",
          pause: "long",
        },
        { text: "Não tire\nconclusões precipitadas.", pause: "short" },
        { text: "Ainda faltam\nseis Eras.", pause: "long" },
      ],
      cta: "CONTINUAR",
    },
    {
      kind: "quiz",
      id: "era7-combina",
      prompt: [{ text: "Qual destas coisas\nmais combina com vocês?" }],
      options: [
        { id: "piadas", label: "Fazer piadas." },
        { id: "filmes", label: "Assistir filmes." },
        { id: "comer", label: "Comer juntos." },
        { id: "caos", label: "Transformar qualquer situação em caos." },
      ],
      anyAnswerAccepted: true,
      onCorrect: [
        { text: "Resposta incompleta.", pause: "short" },
        { text: "A resposta correta\nera todas.", pause: "long" },
      ],
    },
    {
      kind: "quiz",
      id: "era7-te-amo",
      prompt: [{ text: "Quem costuma falar\n“te amo” primeiro?" }],
      options: [
        { id: "lucas", label: `${projectConfig.playerOneName}.` },
        { id: "cacau", label: `${projectConfig.playerTwoJokeName}.` },
        { id: "os-dois", label: "Os dois." },
        { id: "completa", label: "A frase já vem completa." },
      ],
      anyAnswerAccepted: true,
      onCorrect: [{ text: "Registrado.", pause: "long" }],
    },
    {
      kind: "quiz",
      id: "era7-idiota",
      prompt: [{ text: "E quem acrescenta\n“idiota”?" }],
      options: [
        { id: "lucas", label: `${projectConfig.playerOneName}.` },
        { id: "cacau", label: `${projectConfig.playerTwoJokeName}.` },
        { id: "os-dois", label: "Os dois." },
        { id: "completa", label: "A frase já vem completa." },
      ],
      anyAnswerAccepted: true,
      onCorrect: [
        { text: "Não existe resposta errada\npara essa pergunta.", pause: "long" },
      ],
    },
    {
      // O modo simpático em ação: um elogio sincero, entregue e retirado
      // dentro da mesma tela.
      kind: "quiz",
      id: "era7-elogio",
      prompt: [
        { text: "Hoje eu queria\nte elogiar de verdade.", pause: "short" },
        { text: "Escolha o elogio\nque você prefere ouvir.", pause: "short" },
      ],
      options: [
        { id: "engracado", label: "Que eu sou engraçado." },
        { id: "bonito", label: "Que eu sou bonito." },
        { id: "inteligente", label: "Que eu sou inteligente." },
        { id: "paciente", label: "Que eu sou paciente." },
      ],
      anyAnswerAccepted: true,
      onCorrect: [
        { text: "Ótima escolha.", pause: "short" },
        { text: "É verdade,\naliás.", pause: "short" },
        { text: "Todas eram.", pause: "long" },
        { text: "Menos a última.", pause: "long" },
      ],
    },
    {
      kind: "quiz",
      id: "era7-provavel",
      prompt: [{ text: "Qual destas situações\né mais provável?" }],
      options: [
        {
          id: "projeto",
          label: "Lucas criar um projeto complexo para algo simples.",
        },
        { id: "taylor", label: "Taylor Swift aparecer novamente." },
        { id: "todas", label: "Todas as anteriores.", correct: true },
      ],
      onWrong: [{ text: "Incompleto.\nPensa maior." }],
      onCorrect: [{ text: "I Think He Knows.", pause: "long" }],
    },
    { kind: "minigame", id: "era7-paper-rings", game: "paperRings" },
    { kind: "item", id: "era7-anel", itemId: "anel-de-papel" },
    { kind: "file", id: "era7-arquivo", fileId: "arquivo-022" },
    {
      // O asterisco cobra a fatura: o sistema declara o jogador
      // incompatível com uma pessoa razoável e segue em frente.
      kind: "interrupt",
      id: "era7-erro-22",
      error: "erro-22",
      lines: [
        { text: "Isso não afeta\no modo simpático.", pause: "short" },
        { text: "O modo simpático\nnunca existiu.", pause: "long" },
      ],
    },
    {
      kind: "eraOutro",
      id: "era7-outro",
      // O contador finalmente admite que anda para trás.
      progressLabel: "91%",
      recalculatedLabel: "89%",
      recalculatedLines: [
        { text: "Você regrediu.", pause: "short" },
        { text: "Não me pergunte como.", pause: "long" },
        {
          text: "Você ainda não chegou\nnem perto da Era final.",
          pause: "long",
        },
      ],
      lines: [{ text: "Quase lá.", pause: "short" }],
      cta: "ABRIR FOLKLORE",
    },
  ],
};
