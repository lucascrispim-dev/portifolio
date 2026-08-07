/**
 * O jogo aparenta ter 13 Eras, mas só as 8 primeiras existem de fato.
 * As Eras IX a XIII servem à ficção de que o projeto continua depois —
 * elas nunca saem de "locked" (ver docs/roteiro/DIRECAO-DEFINITIVA.md).
 */
export type EraId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;

export type PlayableEraId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export const ERA_IDS: EraId[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

export const PLAYABLE_ERA_IDS: PlayableEraId[] = [1, 2, 3, 4, 5, 6, 7, 8];

export const LAST_PLAYABLE_ERA: PlayableEraId = 8;

export function isPlayableEra(era: EraId): era is PlayableEraId {
  return era <= LAST_PLAYABLE_ERA;
}

export type EraStatus = "locked" | "available" | "active" | "completed";

/**
 * Etapas da sequência final. Persistidas para que recarregar a página
 * depois do "ENCERRAR" não devolva o jogador ao jogo nem repita a
 * surpresa do começo.
 *
 * `lookAtHim` é a tela parada onde o pedido acontece de verdade, fora da
 * tela; `answered` é a continuação que Lucas dispara depois do sim.
 */
export type FinalStage =
  | "playing"
  | "confession"
  | "eraXiii"
  | "transferring"
  | "lookAtHim"
  | "answered";

/**
 * Etapas do falso reset. Persistidas de propósito: se o navegador for
 * fechado no meio do susto, o jogo volta exatamente onde estava — o
 * progresso real nunca é apagado, só encoberto.
 */
export type FakeResetStage = "none" | "erro13" | "replaying" | "revealed";

export type EraTexture = "paper" | "grain" | "polaroid" | "manuscript" | "none";

export type EraTheme = {
  background: string;
  backgroundGradient?: string;
  foreground: string;
  accent: string;
  secondary: string;
  /**
   * Cor do texto sobre um botão primário (preenchido com `foreground`).
   * Precisa contrastar com `foreground`, o que `accent` nem sempre faz —
   * em temas de fundo escuro, `accent` e `foreground` são ambos claros.
   */
  buttonTextColor: string;
  /** Cor de texto legível sobre uma superfície preenchida com `accent`. */
  accentTextColor: string;
  texture: EraTexture;
  titleFontFamily: string;
  bodyFontFamily: string;
  radius: number;
};

export type NarratorLine = {
  text: string;
  pause?: "short" | "long";
};

export type QuizOption = {
  id: string;
  label: string;
  correct?: boolean;
  /** Resposta do narrador exclusiva desta alternativa (ex.: "Enchanted"). */
  response?: NarratorLine[];
};

export type Achievement = {
  id: string;
  title: string;
  description?: string;
};

/** Entrada do mapa de progresso — inclui as Eras que não existem. */
export type EraCatalogEntry = {
  id: EraId;
  /** Número exibido com dois dígitos ("01", "13"). */
  label: string;
  title: string;
  playable: boolean;
};

/**
 * Identificadores dos sistemas paralelos. Ficam como `string` no estado
 * salvo (é o que sobrevive a um JSON), mas os catálogos em
 * `src/content/` são a fonte de verdade do que cada id significa.
 */
export type InventoryItem = {
  id: string;
  name: string;
  /** Desenho do item. Sem emoji: o roteiro só permite 🏆 e 🖕. */
  glyph: InventoryGlyph;
  /** A descrição inútil que o sistema dá. Nunca explica nada. */
  note: string;
  /** Fala curta do narrador no momento em que o item aparece. */
  foundLine: string;
};

export type InventoryGlyph =
  | "bracelet"
  | "remote"
  | "leaf"
  | "pizza"
  | "stone"
  | "map"
  | "milk"
  | "scarf"
  | "clipping"
  | "ring"
  | "string";

export type SecretFile = {
  id: string;
  /** "ARQUIVO 004" — a numeração pula de propósito. */
  code: string;
  name: string;
  /** Corpo do arquivo. Cada linha entra como bloco monoespaçado. */
  body: string[];
  /** Comentário do narrador ao abrir. */
  comment?: NarratorLine[];
};

export type SystemErrorId =
  | "erro-08"
  | "erro-22"
  | "dados-corrompidos"
  | "reconectando"
  | "versao-incompativel"
  | "tentando-restaurar";

export type SystemErrorSpec = {
  id: SystemErrorId;
  /** Título em caixa alta, como o sistema o exibe. */
  code: string;
  detail: string[];
  /** O que o sistema diz quando "resolve" o problema. */
  resolution: string;
  /** Falas do narrador depois que passa. */
  after: NarratorLine[];
};

export type EraScreen =
  | { kind: "lines"; id: string; lines: NarratorLine[]; cta: string }
  | {
      kind: "titleCard";
      id: string;
      eraLabel: string;
      title: string;
      tagline: NarratorLine[];
      cta: string;
    }
  | {
      kind: "quiz";
      id: string;
      prompt: NarratorLine[];
      options: QuizOption[];
      anyAnswerAccepted?: boolean;
      onCorrect: NarratorLine[];
      onWrong?: NarratorLine[];
      achievement?: Achievement;
      cta?: string;
    }
  | {
      kind: "reveal";
      id: string;
      /** Bloco monoespaçado exibido antes das falas (ex.: ARQUIVO LOCALIZADO). */
      systemBlock?: string[];
      lines: NarratorLine[];
      achievement?: Achievement;
      cta?: string;
    }
  | {
      kind: "compatibility";
      id: string;
      label?: string;
      lines: NarratorLine[];
      /** Ativa o easter egg "the 1" no dígito 1 do resultado. */
      theOneEasterEgg?: boolean;
      footerBlock?: string[];
      cta?: string;
    }
  | {
      kind: "openQuestion";
      id: string;
      /** Chave usada para guardar a resposta em `openAnswers`. */
      questionId: string;
      label?: string;
      prompt: NarratorLine[];
      submitLabel?: string;
      /** Repete a frase digitada antes da resposta do narrador. */
      echo?: boolean;
      response: NarratorLine[];
      cta?: string;
    }
  | { kind: "minigame"; id: string; game: MinigameKind; cta?: string }
  | { kind: "progressMap"; id: string; cta: string }
  /**
   * O vazamento da Era III. O narrador diz o que não devia, se censura
   * tarde demais, e é assim — e só assim — que a Era XIII entra na
   * história.
   */
  | { kind: "leak"; id: string; cta?: string }
  /** Entrega um item do inventário. O sistema nunca diz para que serve. */
  | { kind: "item"; id: string; itemId: string; cta?: string }
  /** Libera um arquivo secreto e deixa o jogador ler. */
  | { kind: "file"; id: string; fileId: string; cta?: string }
  /**
   * Um "defeito" roteirizado: o sistema trava, se recupera sozinho e faz
   * piada. Nada aqui é aleatório — todo erro do jogo é planejado.
   */
  | {
      kind: "interrupt";
      id: string;
      error: SystemErrorId;
      /** Falas extras depois da recuperação, além das do próprio erro. */
      lines?: NarratorLine[];
      cta?: string;
    }
  | {
      kind: "eraOutro";
      id: string;
      /**
       * O número exibido é declarado pela Era, não calculado: o progresso
       * mente de propósito (sobe, desce, "recalcula"). Ver o roteiro.
       */
      progressLabel: string;
      /** Segundo número, mostrado depois de "Recalculando...". */
      recalculatedLabel?: string;
      recalculatedLines?: NarratorLine[];
      lines: NarratorLine[];
      cta: string;
    }
  | { kind: "erro13"; id: string }
  | { kind: "saveAndEnd"; id: string };

export type MinigameKind =
  | "nameChallenge"
  | "trustScale"
  | "ourSong"
  | "loveStory"
  | "handToLucas"
  | "enchantedStars"
  | "bathroomMaze"
  | "woodsLabyrinth"
  | "penaltyShootout"
  | "callItWhatYouWant"
  | "paperRings"
  | "invisibleString"
  | "clawMachine"
  | "drivingTest"
  | "reputationTrial"
  | "stillnessTest";

export type EraDefinition = {
  id: PlayableEraId;
  code: string;
  title: string;
  album: string;
  theme: EraTheme;
  screens: EraScreen[];
  achievements: Achievement[];
};

/**
 * Contadores que alimentam o painel de ESTATÍSTICAS. Só entram aqui os
 * números que precisam sobreviver a um reload — os de sessão (toques,
 * tempo aberto) vivem em memória, em `useSessionStats`.
 */
export type GameStats = {
  /** Perguntas efetivamente respondidas, de qualquer tipo. */
  answers: number;
  /** Quantas vezes o sistema "quebrou" na frente dele. */
  errors: number;
};

export type GameProgress = {
  schemaVersion: 4;
  introCompleted: boolean;
  noButtonAttempts: number;
  noButtonDestroyed: boolean;
  termsAccepted: boolean;
  currentEra: PlayableEraId;
  eraStatuses: Record<EraId, EraStatus>;
  eraSceneIndex: Record<PlayableEraId, number>;
  achievements: string[];
  easterEggs: string[];
  /** Respostas digitadas em campos livres, por id de pergunta. */
  openAnswers: Record<string, string>;
  /** A opção que Lucas escolhe escondido na Era III. Nunca é revelada. */
  lucasChoice: string | null;
  /** Contador de paciência: só desce, nunca sobe. */
  patience: number;
  fakeResetStage: FakeResetStage;
  /** Quantas vezes tentou abrir a Era XIII — escolhe a mensagem irônica. */
  eraXiiiTapCount: number;
  /**
   * A Era XIII não aparece no mapa desde o começo. Ela é descoberta por
   * um vazamento do narrador na Era III — antes disso o jogo só admite
   * doze Eras, e o mapa não tem o cartão classificado.
   */
  eraXiiiDiscovered: boolean;
  /** Itens coletados, na ordem em que apareceram. */
  inventory: string[];
  /** Arquivos secretos já localizados. */
  files: string[];
  stats: GameStats;
  finalStage: FinalStage;
};
