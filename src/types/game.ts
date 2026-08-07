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
  | "invisibleString";

export type EraDefinition = {
  id: PlayableEraId;
  code: string;
  title: string;
  album: string;
  theme: EraTheme;
  screens: EraScreen[];
  achievements: Achievement[];
};

export type GameProgress = {
  schemaVersion: 3;
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
  finalStage: FinalStage;
};
