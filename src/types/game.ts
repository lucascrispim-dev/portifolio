export type EraId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export const ERA_IDS: EraId[] = [1, 2, 3, 4, 5, 6, 7, 8];

/**
 * Eras I-VI progress through the full "waiting_for_event" gate.
 * Era VII completes automatically at the end of its scene sequence
 * (it has no offline mission of its own — see docs/roteiro/ERA VII).
 * Era VIII never leaves "active" — it is terminal.
 */
export type EraStatus =
  | "locked"
  | "available"
  | "active"
  | "waiting_for_event"
  | "confirming_event"
  | "completed";

export type NarrativeEvent =
  | "NEW_MEMORY_CONFIRMED"
  | "SHARED_MOMENT_CONFIRMED"
  | "MOVIE_EXPERIENCE_CONFIRMED"
  | "CONVERSATION_CONFIRMED"
  | "ANOTHER_MEMORY_CONFIRMED"
  | "PRIVATE_MOMENT_CONFIRMED"
  | "FINAL_STEP_READY";

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
  /** Cor de texto legível sobre uma superfície preenchida com `accent` (ex.: badges). */
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
};

export type Badge = {
  id: string;
  title: string;
  description?: string;
};

export type EventConfirmationCopy = {
  reopenLines: NarratorLine[];
  question: NarratorLine[];
  notYetResponse: NarratorLine[];
  confirmQuestion: string;
  maybeResponse: NarratorLine[];
  doubtResponse: NarratorLine[];
  certainResponse: NarratorLine[];
  analyzingLabel: string;
  eventLabel: string;
  registeredLines: NarratorLine[];
};

export type EraScreen =
  | { kind: "lines"; id: string; lines: NarratorLine[]; cta: string }
  | {
      kind: "titleCard";
      id: string;
      eraLabel: string;
      title: string;
      tagline: string;
      cta: string;
      titleTapEasterEgg?: {
        tapsRequired: number;
        badge: Badge;
        message: string;
      };
    }
  | {
      kind: "quiz";
      id: string;
      prompt: NarratorLine[];
      options: QuizOption[];
      anyAnswerAccepted?: boolean;
      onCorrect: NarratorLine[];
      onWrong?: NarratorLine[];
      badge?: Badge;
    }
  | { kind: "reveal"; id: string; lines: NarratorLine[]; badge?: Badge }
  | {
      kind: "compatibility";
      id: string;
      lines: NarratorLine[];
      flickerBeforeSettle?: boolean;
    }
  | {
      kind: "mission";
      id: string;
      lines: NarratorLine[];
      missionLabel: string;
      missionLines: string[];
      cta: string;
      waitingLines: NarratorLine[];
      waitingCta: string;
    }
  | { kind: "closing"; id: string; lines: NarratorLine[]; cta?: string }
  | { kind: "finalTransfer"; id: string };

export type EraDefinition = {
  id: EraId;
  code: string;
  title: string;
  album: string;
  theme: EraTheme;
  screens: EraScreen[];
  completionEvent?: NarrativeEvent;
  eventConfirmation?: EventConfirmationCopy;
  badges: Badge[];
};

export type GameProgress = {
  schemaVersion: 1;
  introCompleted: boolean;
  noButtonAttempts: number;
  noButtonDestroyed: boolean;
  termsAccepted: boolean;
  currentEra: EraId;
  eraStatuses: Record<EraId, EraStatus>;
  eraSceneIndex: Record<EraId, number>;
  completedEvents: NarrativeEvent[];
  badges: string[];
  easterEggs: string[];
  compatibilityRevealed: boolean;
  finalSequenceCompleted: boolean;
};
