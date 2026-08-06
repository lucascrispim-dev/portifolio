import { ERA_IDS } from "@/types/game";
import type { EraId, EraStatus, GameProgress } from "@/types/game";
import { createInitialProgress } from "@/lib/storage";

export type GameAction =
  | { type: "HYDRATE"; progress: GameProgress }
  | { type: "NO_BUTTON_ATTEMPT" }
  | { type: "NO_BUTTON_DESTROYED" }
  | { type: "TERMS_ACCEPTED" }
  | { type: "ERA_SCENE_ADVANCE"; era: EraId }
  | { type: "ERA_ENTER_WAITING"; era: EraId }
  | { type: "EVENT_NOT_YET"; era: EraId }
  | { type: "EVENT_MAYBE"; era: EraId }
  | { type: "EVENT_DOUBT"; era: EraId }
  | { type: "EVENT_CONFIRMED"; era: EraId; badgeId?: string }
  | { type: "ERA_COMPLETE"; era: EraId }
  | { type: "ADD_BADGE"; badgeId: string }
  | { type: "ADD_EASTER_EGG"; id: string }
  | { type: "REVEAL_COMPATIBILITY" }
  | { type: "FINAL_SEQUENCE_COMPLETE" }
  | { type: "DEV_RESET" }
  | { type: "DEV_SET_ERA_STATUS"; era: EraId; status: EraStatus }
  | { type: "DEV_UNLOCK_ALL" };

function nextEraId(era: EraId): EraId | null {
  const index = ERA_IDS.indexOf(era);
  const next = ERA_IDS[index + 1];
  return next ?? null;
}

function addUnique<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list : [...list, value];
}

/** Whether the player is currently allowed to progress scenes within `era`. */
function isEraPlayable(status: EraStatus): boolean {
  return status === "available" || status === "active";
}

export function transition(
  progress: GameProgress,
  action: GameAction
): GameProgress {
  switch (action.type) {
    case "HYDRATE":
      return action.progress;

    case "NO_BUTTON_ATTEMPT":
      return { ...progress, noButtonAttempts: progress.noButtonAttempts + 1 };

    case "NO_BUTTON_DESTROYED":
      return { ...progress, noButtonDestroyed: true };

    case "TERMS_ACCEPTED":
      return { ...progress, termsAccepted: true, introCompleted: true };

    case "ERA_SCENE_ADVANCE": {
      const status = progress.eraStatuses[action.era];
      if (!isEraPlayable(status)) return progress;
      return {
        ...progress,
        currentEra: action.era,
        eraStatuses: { ...progress.eraStatuses, [action.era]: "active" },
        eraSceneIndex: {
          ...progress.eraSceneIndex,
          [action.era]: progress.eraSceneIndex[action.era] + 1,
        },
      };
    }

    /** Mission accepted, waiting on a real-world event outside the screen. */
    case "ERA_ENTER_WAITING": {
      const status = progress.eraStatuses[action.era];
      if (!isEraPlayable(status)) return progress;
      return {
        ...progress,
        eraStatuses: {
          ...progress.eraStatuses,
          [action.era]: "waiting_for_event",
        },
      };
    }

    case "EVENT_NOT_YET":
    case "EVENT_MAYBE":
    case "EVENT_DOUBT": {
      const status = progress.eraStatuses[action.era];
      if (status !== "waiting_for_event" && status !== "confirming_event") {
        return progress;
      }
      return {
        ...progress,
        eraStatuses: {
          ...progress.eraStatuses,
          [action.era]: "waiting_for_event",
        },
      };
    }

    /**
     * Acontecimento confirmado: a Era volta a ficar "active" e a cena
     * avança para a próxima (badge/encerramento) — ela só é marcada
     * "completed" quando a própria tela de encerramento é concluída
     * (ver ERA_COMPLETE), pois ainda há telas a mostrar depois do gate.
     */
    case "EVENT_CONFIRMED": {
      const status = progress.eraStatuses[action.era];
      if (status !== "waiting_for_event" && status !== "confirming_event") {
        return progress;
      }
      return {
        ...progress,
        eraStatuses: { ...progress.eraStatuses, [action.era]: "active" },
        eraSceneIndex: {
          ...progress.eraSceneIndex,
          [action.era]: progress.eraSceneIndex[action.era] + 1,
        },
        badges: action.badgeId
          ? addUnique(progress.badges, action.badgeId)
          : progress.badges,
      };
    }

    /** Fim de fato de uma Era (tela de encerramento concluída): libera a próxima. */
    case "ERA_COMPLETE": {
      const status = progress.eraStatuses[action.era];
      if (!isEraPlayable(status)) return progress;
      const upcoming = nextEraId(action.era);
      const eraStatuses: Record<EraId, EraStatus> = {
        ...progress.eraStatuses,
        [action.era]: "completed",
      };
      if (upcoming && eraStatuses[upcoming] === "locked") {
        eraStatuses[upcoming] = "available";
      }
      return {
        ...progress,
        eraStatuses,
        currentEra: upcoming ?? action.era,
      };
    }

    case "ADD_BADGE":
      return { ...progress, badges: addUnique(progress.badges, action.badgeId) };

    case "ADD_EASTER_EGG":
      return {
        ...progress,
        easterEggs: addUnique(progress.easterEggs, action.id),
      };

    case "REVEAL_COMPATIBILITY":
      return { ...progress, compatibilityRevealed: true };

    case "FINAL_SEQUENCE_COMPLETE":
      return { ...progress, finalSequenceCompleted: true };

    case "DEV_RESET":
      return createInitialProgress();

    case "DEV_SET_ERA_STATUS":
      return {
        ...progress,
        eraStatuses: {
          ...progress.eraStatuses,
          [action.era]: action.status,
        },
      };

    case "DEV_UNLOCK_ALL": {
      const eraStatuses = { ...progress.eraStatuses };
      ERA_IDS.forEach((id) => {
        if (eraStatuses[id] === "locked") eraStatuses[id] = "available";
      });
      return { ...progress, eraStatuses, introCompleted: true, termsAccepted: true };
    }

    default:
      return progress;
  }
}
