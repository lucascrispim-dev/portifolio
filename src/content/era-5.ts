import { projectConfig } from "@/config/project";
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
 * Era V — 1989.
 *
 * A Era em que o sistema **se moderniza**. Ele instala uma atualização no
 * meio do jogo, anuncia a versão 2.0 com orgulho de release note, lista as
 * melhorias — e continua fazendo exatamente as mesmas coisas de antes,
 * só que mais rápido e mais bonito.
 *
 * É a Era mais longa e a mais cansativa de propósito: leite, um labirinto
 * que sempre volta ao começo e uma cobrança de pênalti que só entra na
 * terceira tentativa. É onde a paciência termina de acabar.
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
      // As notas de versão. Toda linha é verdadeira e nenhuma é útil.
      kind: "reveal",
      id: "era5-changelog",
      systemBlock: [
        "NOTAS DA VERSÃO 2.0",
        "",
        "+ Interface redesenhada",
        "+ Animações mais suaves",
        "+ Novo sistema de partículas",
        "+ Correção de 3 bugs",
        "+ Introdução de 7 bugs",
        "",
        "- Removido: modo fácil",
        "- Removido: botão de pular",
        `- Removido: paciência de ${projectConfig.playerTwoJokeName}`,
      ],
      lines: [
        { text: "Atualização instalada.", pause: "short" },
        { text: "Nada mudou\nno funcionamento.", pause: "short" },
        { text: "Mas repare\nem como está bonito.", pause: "long" },
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
    { kind: "item", id: "era5-leite-item", itemId: "copo-de-leite" },
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
    { kind: "file", id: "era5-arquivo-leite", fileId: "arquivo-007" },
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
    { kind: "item", id: "era5-cachecol", itemId: "cachecol-tricolor" },
    { kind: "minigame", id: "era5-penalti", game: "penaltyShootout" },
    {
      // Depois de instalar a versão 2.0 com tanta pompa, o sistema
      // descobre que o incompatível é o jogador. E segue mesmo assim.
      kind: "interrupt",
      id: "era5-incompativel",
      error: "versao-incompativel",
    },
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
