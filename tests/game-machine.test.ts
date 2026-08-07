import { describe, expect, it } from "vitest";
import { transition } from "@/lib/game-machine";
import { createInitialProgress } from "@/lib/storage";
import { eraDefinitions } from "@/content/eras";
import { PLAYABLE_ERA_IDS } from "@/types/game";
import type { EraId, GameProgress, PlayableEraId } from "@/types/game";

/** Percorre todas as cenas de uma Era e a conclui. */
function playEra(progress: GameProgress, era: PlayableEraId): GameProgress {
  const total = eraDefinitions[era].screens.length;
  let next = progress;
  for (let i = 0; i < total; i++) {
    next = transition(next, { type: "ERA_SCENE_ADVANCE", era });
  }
  return transition(next, { type: "ERA_COMPLETE", era });
}

const PHANTOM_ERAS: EraId[] = [9, 10, 11, 12, 13];

describe("estado inicial", () => {
  it("começa com a Era I disponível e todas as outras bloqueadas", () => {
    const progress = createInitialProgress();
    expect(progress.eraStatuses[1]).toBe("available");
    for (let era = 2; era <= 13; era++) {
      expect(progress.eraStatuses[era as EraId]).toBe("locked");
    }
    expect(progress.currentEra).toBe(1);
    expect(progress.finalStage).toBe("playing");
    expect(progress.schemaVersion).toBe(2);
  });
});

describe("progressão contínua", () => {
  it("concluir uma Era abre a próxima imediatamente", () => {
    let progress = createInitialProgress();
    progress = playEra(progress, 1);
    expect(progress.eraStatuses[1]).toBe("completed");
    expect(progress.eraStatuses[2]).toBe("available");
    expect(progress.currentEra).toBe(2);
    // Sem espera — mas também sem pular: a Era III segue trancada.
    expect(progress.eraStatuses[3]).toBe("locked");
  });

  it("percorre as 8 Eras jogáveis em sequência", () => {
    let progress = createInitialProgress();
    for (const era of PLAYABLE_ERA_IDS) {
      expect(progress.currentEra).toBe(era);
      progress = playEra(progress, era);
    }
    for (const era of PLAYABLE_ERA_IDS) {
      expect(progress.eraStatuses[era]).toBe("completed");
    }
  });

  it("ignora avanço de cena de uma Era trancada", () => {
    const progress = createInitialProgress();
    expect(transition(progress, { type: "ERA_SCENE_ADVANCE", era: 5 })).toEqual(
      progress
    );
  });

  it("ignora conclusão de uma Era que nunca foi jogada", () => {
    const progress = createInitialProgress();
    expect(transition(progress, { type: "ERA_COMPLETE", era: 6 })).toEqual(progress);
  });
});

describe("as Eras IX a XIII nunca existem", () => {
  it("permanecem trancadas mesmo depois de concluir a Era VIII", () => {
    let progress = createInitialProgress();
    for (const era of PLAYABLE_ERA_IDS) {
      progress = playEra(progress, era);
    }
    for (const era of PHANTOM_ERAS) {
      expect(progress.eraStatuses[era]).toBe("locked");
    }
  });

  it("DEV_UNLOCK_ALL destrava só as Eras jogáveis", () => {
    const next = transition(createInitialProgress(), { type: "DEV_UNLOCK_ALL" });
    for (const era of PLAYABLE_ERA_IDS) {
      expect(next.eraStatuses[era]).not.toBe("locked");
    }
    for (const era of PHANTOM_ERAS) {
      expect(next.eraStatuses[era]).toBe("locked");
    }
  });

  it("conta cada tentativa de abrir a Era XIII", () => {
    let progress = createInitialProgress();
    for (let i = 0; i < 5; i++) {
      progress = transition(progress, { type: "ERA_XIII_TAP" });
    }
    expect(progress.eraXiiiTapCount).toBe(5);
  });
});

describe("botão Não e termos", () => {
  it("registra as oito tentativas e a destruição", () => {
    let progress = createInitialProgress();
    for (let i = 0; i < 8; i++) {
      progress = transition(progress, { type: "NO_BUTTON_ATTEMPT" });
    }
    expect(progress.noButtonAttempts).toBe(8);
    progress = transition(progress, { type: "NO_BUTTON_DESTROYED" });
    expect(progress.noButtonDestroyed).toBe(true);
  });

  it("aceitar os termos conclui a introdução", () => {
    const next = transition(createInitialProgress(), { type: "TERMS_ACCEPTED" });
    expect(next.termsAccepted).toBe(true);
    expect(next.introCompleted).toBe(true);
  });
});

describe("coleta", () => {
  it("não duplica achievements nem easter eggs", () => {
    let progress = createInitialProgress();
    progress = transition(progress, { type: "ADD_ACHIEVEMENT", achievementId: "clean" });
    progress = transition(progress, { type: "ADD_ACHIEVEMENT", achievementId: "clean" });
    progress = transition(progress, { type: "ADD_EASTER_EGG", id: "the-1" });
    progress = transition(progress, { type: "ADD_EASTER_EGG", id: "the-1" });
    expect(progress.achievements).toEqual(["clean"]);
    expect(progress.easterEggs).toEqual(["the-1"]);
  });

  it("guarda o texto do Blank Space para reaparecer depois", () => {
    const next = transition(createInitialProgress(), {
      type: "SET_BLANK_SPACE",
      text: "qualquer coisa",
    });
    expect(next.blankSpaceAnswer).toBe("qualquer coisa");
  });
});

describe("sequência final", () => {
  it("avança de playing até final", () => {
    let progress = createInitialProgress();
    progress = transition(progress, { type: "SET_FINAL_STAGE", stage: "interrupted" });
    expect(progress.finalStage).toBe("interrupted");
    progress = transition(progress, { type: "SET_FINAL_STAGE", stage: "transferring" });
    progress = transition(progress, { type: "SET_FINAL_STAGE", stage: "final" });
    expect(progress.finalStage).toBe("final");
  });
});
