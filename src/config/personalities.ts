import type { NarratorLine, PlayableEraId } from "@/types/game";

/**
 * A personalidade do sistema em cada Era.
 *
 * Este arquivo existe para resolver o maior problema do projeto: se cada
 * Era só troca de cor e de perguntas, as oito viram a mesma Era pintada
 * de oito jeitos. Aqui é o **comportamento** que muda — a velocidade com
 * que o narrador digita, o que ele deixa escapar, o que a interface
 * anuncia sozinha, se ele fala em caixa alta ou sussurrando.
 *
 * Cada campo é lido pelo shell do jogo (`GameScreen` → `EraSystemChrome`)
 * e vale para a Era inteira, independente de quais telas ela tem.
 */

/**
 * O jeito de digitar. Não é decoração: é a diferença entre um sistema
 * curioso e um sistema irritado.
 */
export type TypingStyle =
  /** Era I — devagar, examinando cada palavra. */
  | "curious"
  /** Era II — apressado, animado, atropelando as próprias frases. */
  | "eager"
  /** Era III — fala demais e se censura tarde demais. */
  | "leaky"
  /** Era IV — instável, com surtos. */
  | "glitchy"
  /** Era V — rápido e limpo, exibindo a interface nova. */
  | "polished"
  /** Era VI — seco, minúsculo, sem paciência nenhuma. */
  | "dry"
  /** Era VII — doce demais para ser verdade. */
  | "sweet"
  /** Era VIII — quase parando. */
  | "quiet";

export type AmbientEvent = {
  /** Atraso desde a entrada na Era. */
  delayMs: number;
  title: string;
  body?: string;
};

export type EraPersonality = {
  /** Linha de status exibida no topo durante toda a Era. */
  systemLabel: string;
  typing: TypingStyle;
  /** Milissegundos por caractere no efeito de máquina de escrever. */
  typeSpeedMs: number;
  /**
   * Como a Era se anuncia quando o jogador entra nela. Aparece uma vez,
   * no topo, como se o sistema estivesse trocando de modo de operação.
   */
  bootLine: string;
  /**
   * Notificações que chegam sozinhas durante a Era. São a principal
   * razão pela qual o jogo parece estar sempre fazendo alguma coisa
   * enquanto o jogador lê.
   */
  ambient: AmbientEvent[];
};

export const eraPersonalities: Record<PlayableEraId, EraPersonality> = {
  /**
   * Debut — o sistema está conhecendo alguém. Ele observa, anota, erra a
   * conclusão e anota a conclusão errada com a mesma confiança.
   */
  1: {
    systemLabel: "PERFIL: EM CONSTRUÇÃO",
    typing: "curious",
    typeSpeedMs: 26,
    bootLine: "Iniciando observação.",
    ambient: [
      {
        delayMs: 34000,
        title: "PERFIL ATUALIZADO",
        body: "Traço identificado: teimosia.",
      },
      {
        delayMs: 92000,
        title: "ANOTAÇÃO INTERNA",
        body: "Ele está lendo tudo. Isso vai atrapalhar.",
      },
    ],
  },

  /**
   * Fearless — o sistema resolveu que isso aqui é uma aventura. Ele fala
   * rápido, promete coisas grandes e entrega perguntas sobre pizza.
   */
  2: {
    systemLabel: "MODO: EXPEDIÇÃO",
    typing: "eager",
    typeSpeedMs: 15,
    bootLine: "Modo aventura ativado.",
    ambient: [
      {
        delayMs: 26000,
        title: "EXPEDIÇÃO EM ANDAMENTO",
        body: "Distância percorrida: 0 metros.",
      },
      {
        delayMs: 78000,
        title: "CONQUISTA QUASE DESBLOQUEADA",
        body: "Faltou pouco. Não vou dizer para quê.",
      },
    ],
  },

  /**
   * Speak Now — o sistema não consegue ficar calado. É nesta Era que a
   * Era XIII vaza, e o vazamento precisa parecer acidente, não anúncio.
   */
  3: {
    systemLabel: "AVISO: EXCESSO DE FALA",
    typing: "leaky",
    typeSpeedMs: 20,
    bootLine: "Filtro de confidencialidade: instável.",
    ambient: [
      {
        delayMs: 30000,
        title: "LEMBRETE INTERNO",
        body: "Não mencionar a parte classificada.",
      },
      {
        delayMs: 88000,
        title: "LEMBRETE INTERNO",
        body: "Sério. Não mencionar.",
      },
    ],
  },

  /**
   * Red — tudo instável. Erros de verdade (roteirizados), mudanças
   * bruscas, o sistema se contradizendo dentro da mesma frase.
   */
  4: {
    systemLabel: "ESTABILIDADE: BAIXA",
    typing: "glitchy",
    typeSpeedMs: 18,
    bootLine: "Recuperando de falha anterior.",
    ambient: [
      {
        delayMs: 22000,
        title: "AVISO",
        body: "Três processos não responderam. Ignorados.",
      },
      {
        delayMs: 64000,
        title: "MEMÓRIA",
        body: "Um registro desta Era foi apagado. Não pergunte qual.",
      },
      {
        delayMs: 118000,
        title: "AVISO",
        body: "Tudo está bem. Repetindo: tudo está bem.",
      },
    ],
  },

  /**
   * 1989 — a Era da interface nova. O sistema se moderniza no meio do
   * jogo, anuncia isso com orgulho e continua fazendo exatamente as
   * mesmas coisas de antes.
   */
  5: {
    systemLabel: "INTERFACE 2.0",
    typing: "polished",
    // Rápido e limpo, mas nunca mais afobado que Fearless: a Era II
    // atropela as frases, a Era V só é bem acabada.
    typeSpeedMs: 17,
    bootLine: "Atualização instalada com sucesso.",
    ambient: [
      {
        delayMs: 20000,
        title: "NOVIDADES DA VERSÃO 2.0",
        body: "Nada mudou. Mas está mais bonito.",
      },
      {
        delayMs: 70000,
        title: "DESEMPENHO",
        body: "Velocidade melhorou 40%. A sua não.",
      },
      {
        delayMs: 132000,
        title: "SUPORTE TÉCNICO",
        body: "Lucas foi notificado. Lucas não respondeu.",
      },
    ],
  },

  /**
   * reputation — sem paciência, sem maiúscula, sem vontade de agradar.
   * É a Era em que o narrador para de fingir que é neutro.
   */
  6: {
    systemLabel: "MODO: SEM COMENTÁRIOS",
    typing: "dry",
    typeSpeedMs: 24,
    bootLine: "o sistema não vai comentar isso.",
    ambient: [
      {
        delayMs: 28000,
        title: "SEM COMENTÁRIOS",
        body: "sério.",
      },
      {
        delayMs: 96000,
        title: "REGISTRO",
        body: "alguém falou de vocês hoje. não foi elogio. não vou repetir.",
      },
    ],
  },

  /**
   * Lover — o sistema fica gentil. Elogia, se preocupa, oferece ajuda.
   * Continua exatamente tão sabotador quanto antes, só que sorrindo.
   */
  7: {
    systemLabel: "MODO: SIMPÁTICO*",
    typing: "sweet",
    typeSpeedMs: 22,
    bootLine: "Hoje eu vou pegar leve com você.",
    ambient: [
      {
        delayMs: 24000,
        title: "MENSAGEM CARINHOSA",
        body: "Você está indo muito bem. Isso não é verdade, mas é carinhoso.",
      },
      {
        delayMs: 82000,
        title: "* SOBRE O MODO SIMPÁTICO",
        body: "O asterisco sempre esteve ali.",
      },
    ],
  },

  /**
   * folklore — silêncio. As notificações rareiam, o narrador digita
   * devagar, e o jogo passa a parecer que está terminando. Ele está.
   * Só que não do jeito que o jogador imagina.
   */
  8: {
    systemLabel: "MODO: SILENCIOSO",
    typing: "quiet",
    typeSpeedMs: 38,
    bootLine: "Reduzindo o ruído.",
    ambient: [
      {
        delayMs: 52000,
        title: "ARQUIVAMENTO",
        body: "Organizando o que sobrou.",
      },
      {
        delayMs: 148000,
        title: "ARQUIVAMENTO",
        body: "Quase lá.",
      },
    ],
  },
};

/**
 * O que o narrador tenta esconder na Era III e não consegue. A frase é
 * digitada por inteiro e **depois** censurada na frente do jogador — ele
 * precisa ter tempo de ler antes do bloco preto cobrir.
 *
 * Este é o único caminho pelo qual a Era XIII entra na história. Sem
 * isto o jogo nunca menciona que ela existe.
 */
export const eraThreeLeak: {
  leaked: string;
  redacted: string;
  after: NarratorLine[];
} = {
  leaked: "porque a Era XIII já está escrita há meses",
  redacted: "porque a Era ███ já está ███████ há █████",
  after: [
    { text: "Ignore isso.", pause: "short" },
    { text: "Eu falei demais.", pause: "short" },
    { text: "De novo.", pause: "long" },
  ],
};

/**
 * Velocidade de digitação da Era atual, para quem estiver fora do
 * contexto do jogo (introdução, sequência final). O padrão é o mesmo de
 * antes da existência das personalidades.
 */
export const DEFAULT_TYPE_SPEED_MS = 22;
