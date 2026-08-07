import { PLAYABLE_ERA_IDS, LAST_PLAYABLE_ERA } from "@/types/game";
import type {
  EraId,
  EraStatus,
  FakeResetStage,
  FinalStage,
  GameProgress,
  PlayableEraId,
} from "@/types/game";
import { createInitialProgress } from "@/lib/storage";

export type GameAction =
  | { type: "HYDRATE"; progress: GameProgress }
  | { type: "NO_BUTTON_ATTEMPT" }
  | { type: "NO_BUTTON_DESTROYED" }
  | { type: "TERMS_ACCEPTED" }
  | { type: "ERA_SCENE_ADVANCE"; era: PlayableEraId }
  | { type: "ERA_COMPLETE"; era: PlayableEraId }
  | { type: "ADD_ACHIEVEMENT"; achievementId: string }
  | { type: "ADD_EASTER_EGG"; id: string }
  | { type: "SET_OPEN_ANSWER"; questionId: string; text: string }
  | { type: "SET_LUCAS_CHOICE"; choice: string }
  | { type: "LOSE_PATIENCE"; to: number }
  | { type: "SET_FAKE_RESET_STAGE"; stage: FakeResetStage }
  | { type: "ERA_XIII_TAP" }
  | { type: "SET_FINAL_STAGE"; stage: FinalStage }
  | { type: "RESET" }
  | { type: "DEV_SET_ERA"; era: PlayableEraId }
  | { type: "DEV_SET_FINAL_STAGE"; stage: FinalStage };

function nextPlayableEra(era: PlayableEraId): PlayableEraId | null {
  const index = PLAYABLE_ERA_IDS.indexOf(era);
  return PLAYABLE_ERA_IDS[index + 1] ?? null;
}

function addUnique<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list : [...list, value];
}

/** O jogador só pode avançar cenas da Era em que está. */
function isEraPlayable(status: EraStatus): boolean {
  return status === "available" || status === "active";
}

/** Ordem da sequência final — usada para impedir que ela ande para trás. */
const FINAL_ORDER: FinalStage[] = [
  "playing",
  "confession",
  "eraXiii",
  "transferring",
  "lookAtHim",
  "answered",
];

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

    /**
     * Progressão contínua: concluir uma Era abre a próxima na hora. A
     * Era VIII é a última jogável — depois dela vem a confissão, não uma
     * Era IX (que nunca existe).
     */
    case "ERA_COMPLETE": {
      const status = progress.eraStatuses[action.era];
      if (!isEraPlayable(status)) return progress;

      const upcoming = nextPlayableEra(action.era);
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

    case "ADD_ACHIEVEMENT":
      return {
        ...progress,
        achievements: addUnique(progress.achievements, action.achievementId),
      };

    case "ADD_EASTER_EGG":
      return {
        ...progress,
        easterEggs: addUnique(progress.easterEggs, action.id),
      };

    case "SET_OPEN_ANSWER":
      return {
        ...progress,
        openAnswers: {
          ...progress.openAnswers,
          [action.questionId]: action.text,
        },
      };

    case "SET_LUCAS_CHOICE":
      return { ...progress, lucasChoice: action.choice };

    /** A paciência é de mão única: nenhum caminho a devolve. */
    case "LOSE_PATIENCE":
      return { ...progress, patience: Math.min(progress.patience, action.to) };

    case "SET_FAKE_RESET_STAGE":
      return { ...progress, fakeResetStage: action.stage };

    case "ERA_XIII_TAP":
      return { ...progress, eraXiiiTapCount: progress.eraXiiiTapCount + 1 };

    /** A sequência final nunca volta atrás — nem por recarregar a página. */
    case "SET_FINAL_STAGE": {
      const current = FINAL_ORDER.indexOf(progress.finalStage);
      const next = FINAL_ORDER.indexOf(action.stage);
      if (next <= current) return progress;
      return { ...progress, finalStage: action.stage };
    }

    /**
     * Recomeço do zero. Não é ação de dev: em produção é o único caminho
     * de volta, disparado por `?reiniciar` na URL ou pelo toque longo
     * escondido na última tela (ver lib/restart.ts).
     */
    case "RESET":
      return createInitialProgress();

    case "DEV_SET_ERA": {
      const eraStatuses = { ...progress.eraStatuses };
      PLAYABLE_ERA_IDS.forEach((id) => {
        if (id < action.era) eraStatuses[id] = "completed";
        else if (id === action.era) eraStatuses[id] = "active";
        else eraStatuses[id] = "locked";
      });
      return {
        ...progress,
        introCompleted: true,
        termsAccepted: true,
        currentEra: action.era,
        eraStatuses,
        eraSceneIndex: { ...progress.eraSceneIndex, [action.era]: 0 },
        fakeResetStage: "none",
        finalStage: "playing",
      };
    }

    /** Só o painel de dev pode mover a sequência final livremente (ensaio). */
    case "DEV_SET_FINAL_STAGE":
      return { ...progress, finalStage: action.stage };

    default:
      return progress;
  }
}

/** A Era VIII é a última jogável: depois dela vem o falso encerramento. */
export function isLastPlayableEra(era: PlayableEraId): boolean {
  return era === LAST_PLAYABLE_ERA;
}
