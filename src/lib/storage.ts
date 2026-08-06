import { projectConfig } from "@/config/project";
import { ERA_IDS } from "@/types/game";
import type { EraId, EraStatus, GameProgress } from "@/types/game";

export const SCHEMA_VERSION = 1 as const;

export function createInitialProgress(): GameProgress {
  const eraStatuses = {} as Record<EraId, EraStatus>;
  const eraSceneIndex = {} as Record<EraId, number>;
  ERA_IDS.forEach((id, index) => {
    eraStatuses[id] = index === 0 ? "available" : "locked";
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
    completedEvents: [],
    badges: [],
    easterEggs: [],
    compatibilityRevealed: false,
    finalSequenceCompleted: false,
  };
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Valida a forma mínima esperada de um GameProgress. Não tenta ser
 * exaustivo — o objetivo é recusar JSON corrompido/de versão incompatível
 * e cair de volta para um estado inicial seguro, nunca quebrar a UI.
 */
function isValidProgress(value: unknown): value is GameProgress {
  if (!isPlainObject(value)) return false;
  if (value.schemaVersion !== SCHEMA_VERSION) return false;
  if (typeof value.currentEra !== "number") return false;
  if (!isPlainObject(value.eraStatuses)) return false;
  if (!isPlainObject(value.eraSceneIndex)) return false;
  if (!Array.isArray(value.completedEvents)) return false;
  if (!Array.isArray(value.badges)) return false;
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
