import { projectConfig } from "@/config/project";
import { INITIAL_PATIENCE } from "@/lib/patience";
import { ERA_IDS, PLAYABLE_ERA_IDS } from "@/types/game";
import type {
  EraId,
  EraStatus,
  GameProgress,
  PlayableEraId,
} from "@/types/game";

export const SCHEMA_VERSION = 3 as const;

export function createInitialProgress(): GameProgress {
  const eraStatuses = {} as Record<EraId, EraStatus>;
  ERA_IDS.forEach((id) => {
    eraStatuses[id] = id === 1 ? "available" : "locked";
  });

  const eraSceneIndex = {} as Record<PlayableEraId, number>;
  PLAYABLE_ERA_IDS.forEach((id) => {
    eraSceneIndex[id] = 0;
  });

  return {
    schemaVersion: SCHEMA_VERSION,
    introCompleted: false,
    noButtonAttempts: 0,
    noButtonDestroyed: false,
    termsAccepted: false,
    currentEra: 1,
    eraStatuses,
    eraSceneIndex,
    achievements: [],
    easterEggs: [],
    openAnswers: {},
    lucasChoice: null,
    patience: INITIAL_PATIENCE,
    fakeResetStage: "none",
    eraXiiiTapCount: 0,
    finalStage: "playing",
  };
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Valida a forma mínima esperada de um GameProgress. Não tenta ser
 * exaustivo — o objetivo é recusar JSON corrompido ou de versão
 * incompatível e cair de volta para um estado inicial seguro, nunca
 * quebrar a interface.
 */
function isValidProgress(value: unknown): value is GameProgress {
  if (!isPlainObject(value)) return false;
  if (value.schemaVersion !== SCHEMA_VERSION) return false;
  if (typeof value.currentEra !== "number") return false;
  if (!isPlainObject(value.eraStatuses)) return false;
  if (!isPlainObject(value.eraSceneIndex)) return false;
  if (!isPlainObject(value.openAnswers)) return false;
  if (!Array.isArray(value.achievements)) return false;
  if (!Array.isArray(value.easterEggs)) return false;
  if (typeof value.patience !== "number") return false;
  if (typeof value.fakeResetStage !== "string") return false;
  if (typeof value.finalStage !== "string") return false;
  return true;
}

export function loadProgress(): GameProgress {
  if (typeof window === "undefined") return createInitialProgress();

  try {
    const raw = window.localStorage.getItem(projectConfig.storageKey);
    if (!raw) return createInitialProgress();

    const parsed = JSON.parse(raw);
    if (!isValidProgress(parsed)) return createInitialProgress();

    return parsed;
  } catch {
    return createInitialProgress();
  }
}

export function saveProgress(progress: GameProgress): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      projectConfig.storageKey,
      JSON.stringify(progress)
    );
  } catch {
    // Armazenamento indisponível (modo privado, cota excedida etc.) —
    // a experiência continua funcionando apenas sem persistência.
  }
}

export function clearProgress(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(projectConfig.storageKey);
  } catch {
    // ignore
  }
}
