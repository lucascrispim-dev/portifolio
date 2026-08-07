/**
 * O jogo aparenta ter 13 Eras, mas só as 8 primeiras existem de fato.
 * As Eras IX a XIII servem à ficção de que o projeto continua depois —
 * elas nunca saem de "locked" (ver docs/roteiro/NOVO-FLUXO-13-ERAS.md).
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
 */
export type FinalStage =
  | "playing"
  | "interrupted"
  | "transferring"
  | "final";

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
  | { kind: "minigame"; id: string; game: MinigameKind; cta?: string }
  | { kind: "progressMap"; id: string; cta: string }
  | {
      kind: "eraOutro";
      id: string;
      /** Progresso exibido: "N de 13" ou um percentual já formatado. */
      progressLabel: string;
      lines: NarratorLine[];
      cta: string;
    }
  | { kind: "saveAndEnd"; id: string }
  | { kind: "interruption"; id: string };

export type MinigameKind =
  | "wordSearch"
  | "starCursor"
  | "blankSpace"
  | "waterCup"
  | "paperRings"
  | "fileCards"
  | "cruelSummer"
  | "noTouchButton"
  | "trustScale";

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
  schemaVersion: 2;
  introCompleted: boolean;
  noButtonAttempts: number;
  noButtonDestroyed: boolean;
  termsAccepted: boolean;
  currentEra: PlayableEraId;
  eraStatuses: Record<EraId, EraStatus>;
  eraSceneIndex: Record<PlayableEraId, number>;
  achievements: string[];
  easterEggs: string[];
  /** Texto digitado no minijogo Blank Space (Era V), relido na Era VIII. */
  blankSpaceAnswer: string;
  /** Quantas vezes tentou abrir a Era XIII — escolhe a mensagem irônica. */
  eraXiiiTapCount: number;
  finalStage: FinalStage;
};
