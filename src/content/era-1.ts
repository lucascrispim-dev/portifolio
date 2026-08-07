import { projectConfig } from "@/config/project";
import { eraThemes } from "@/config/themes";
import type { EraDefinition } from "@/types/game";

const DEBUT = {
  id: "debut",
  title: "DEBUT",
  description:
    "Você concluiu uma Era sem saber absolutamente nada sobre o prêmio.",
};

/**
 * Era I — Debut.
 *
 * O sistema está **conhecendo alguém**. Essa é a personalidade da Era e
 * ela dita tudo: ele observa, anota, tira conclusões erradas com enorme
 * confiança e monta um perfil que nunca mais é mencionado.
 *
 * A Era estabelece as três regras do jogo em poucos minutos — o narrador
 * pergunta coisas, não aceita as respostas, e o número de progresso não
 * tem relação nenhuma com a realidade — e mais nada. Nenhuma pista do
 * final, nenhuma menção à Era XIII: a promessa só existe a partir da
 * Era III, quando ele se trai.
 */
export const era1: EraDefinition = {
  id: 1,
  code: "I",
  title: "Debut",
  album: "Taylor Swift",
  theme: eraThemes[1],
  achievements: [DEBUT],
  screens: [
    // O mapa abre o jogo com doze Eras e um plano de aparência completa.
    // O décimo terceiro cartão ainda não existe aqui.
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
    {
      // Uma pergunta que só existe para o sistema poder discordar da
      // resposta, qualquer que ela seja.
      kind: "quiz",
      id: "era1-expectativa",
      prompt: [
        { text: "Qual é a sua expectativa\npara este projeto?" },
      ],
      options: [
        { id: "alta", label: "Alta." },
        { id: "media", label: "Média." },
        { id: "baixa", label: "Baixa." },
        { id: "medo", label: "Estou com um pouco de medo." },
      ],
      anyAnswerAccepted: true,
      onCorrect: [
        { text: "Anotado.", pause: "short" },
        { text: "Sua expectativa\nestá calibrada\nincorretamente.", pause: "short" },
        { text: "Não vou dizer\npara qual lado.", pause: "long" },
      ],
    },
    {
      // O perfil montado pelo sistema. Todas as conclusões são erradas,
      // e ele as apresenta como fato consumado.
      kind: "reveal",
      id: "era1-perfil",
      systemBlock: [
        "PERFIL PARCIAL",
        "",
        `Sujeito: ${projectConfig.playerTwoJokeName}`,
        "Idade estimada: 13",
        "Signo: irrelevante",
        "Time: a confirmar",
        "Filme favorito: a confirmar",
        "Bebida favorita: leite",
        "",
        "Confiabilidade dos dados: 12%",
      ],
      lines: [
        { text: "Montei um perfil seu.", pause: "short" },
        { text: "Alguns campos\nestão errados.", pause: "short" },
        { text: "Não vou corrigir\nnenhum deles.", pause: "long" },
      ],
      cta: "CONTINUAR",
    },
    { kind: "minigame", id: "era1-our-song", game: "ourSong" },
    {
      // O primeiro item. Nada explica o inventário — ele simplesmente
      // passa a existir, com moldura, laudo e nenhuma utilidade.
      kind: "item",
      id: "era1-pulseira",
      itemId: "pulseira-taylor",
    },
    { kind: "file", id: "era1-arquivo", fileId: "arquivo-001" },
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
