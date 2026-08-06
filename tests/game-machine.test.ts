import { describe, expect, it } from "vitest";
import { transition } from "@/lib/game-machine";
import { createInitialProgress } from "@/lib/storage";

describe("game-machine: initial state", () => {
  it("starts with only Era I available and every other Era locked", () => {
    const progress = createInitialProgress();
    expect(progress.eraStatuses[1]).toBe("available");
    for (const era of [2, 3, 4, 5, 6, 7, 8] as const) {
      expect(progress.eraStatuses[era]).toBe("locked");
    }
    expect(progress.currentEra).toBe(1);
    expect(progress.introCompleted).toBe(false);
  });
});

describe("game-machine: era gating (no skipping)", () => {
  it("ignores ERA_SCENE_ADVANCE for a locked Era", () => {
    const progress = createInitialProgress();
    const next = transition(progress, { type: "ERA_SCENE_ADVANCE", era: 3 });
    expect(next).toEqual(progress);
    expect(next.eraStatuses[3]).toBe("locked");
  });

  it("advances scenes only for an available/active Era", () => {
    const progress = createInitialProgress();
    const next = transition(progress, { type: "ERA_SCENE_ADVANCE", era: 1 });
    expect(next.eraStatuses[1]).toBe("active");
    expect(next.eraSceneIndex[1]).toBe(1);
  });

  it("ignores ERA_COMPLETE for an Era that was never played", () => {
    const progress = createInitialProgress();
    const next = transition(progress, { type: "ERA_COMPLETE", era: 5 });
    expect(next).toEqual(progress);
  });
});

describe("game-machine: waiting_for_event gate", () => {
  function toWaiting(eraId: 1 = 1) {
    let progress = createInitialProgress();
    progress = transition(progress, { type: "ERA_SCENE_ADVANCE", era: eraId });
    progress = transition(progress, { type: "ERA_ENTER_WAITING", era: eraId });
    return progress;
  }

  it("enters waiting_for_event after the mission is accepted", () => {
    const progress = toWaiting();
    expect(progress.eraStatuses[1]).toBe("waiting_for_event");
  });

  it('answering "ainda não" keeps the Era pending', () => {
    const waiting = toWaiting();
    const next = transition(waiting, { type: "EVENT_NOT_YET", era: 1 });
    expect(next.eraStatuses[1]).toBe("waiting_for_event");
    expect(next.eraStatuses[2]).toBe("locked");
  });

  it('"talvez" and "dúvida" also keep the Era pending', () => {
    const waiting = toWaiting();
    expect(transition(waiting, { type: "EVENT_MAYBE", era: 1 }).eraStatuses[1]).toBe(
      "waiting_for_event"
    );
    expect(transition(waiting, { type: "EVENT_DOUBT", era: 1 }).eraStatuses[1]).toBe(
      "waiting_for_event"
    );
  });

  it("confirming the event resumes the Era (not completed yet) and advances the scene", () => {
    const waiting = toWaiting();
    const sceneBefore = waiting.eraSceneIndex[1];
    const next = transition(waiting, {
      type: "EVENT_CONFIRMED",
      era: 1,
      badgeId: "begin-again",
    });
    expect(next.eraStatuses[1]).toBe("active");
    expect(next.eraSceneIndex[1]).toBe(sceneBefore + 1);
    expect(next.badges).toContain("begin-again");
    // A próxima Era só é liberada quando a tela de encerramento é concluída.
    expect(next.eraStatuses[2]).toBe("locked");
  });

  it("only unlocks the next Era once ERA_COMPLETE fires after the gate", () => {
    let progress = toWaiting();
    progress = transition(progress, { type: "EVENT_CONFIRMED", era: 1 });
    progress = transition(progress, { type: "ERA_COMPLETE", era: 1 });
    expect(progress.eraStatuses[1]).toBe("completed");
    expect(progress.eraStatuses[2]).toBe("available");
    expect(progress.currentEra).toBe(2);
    // Eras further ahead remain locked.
    expect(progress.eraStatuses[3]).toBe("locked");
  });

  it("ignores EVENT_CONFIRMED when the Era isn't actually waiting", () => {
    const progress = createInitialProgress();
    const next = transition(progress, { type: "EVENT_CONFIRMED", era: 1 });
    expect(next).toEqual(progress);
  });
});

describe("game-machine: no-button + terms", () => {
  it("counts No-button attempts and marks it destroyed", () => {
    let progress = createInitialProgress();
    for (let i = 0; i < 8; i++) {
      progress = transition(progress, { type: "NO_BUTTON_ATTEMPT" });
    }
    expect(progress.noButtonAttempts).toBe(8);
    progress = transition(progress, { type: "NO_BUTTON_DESTROYED" });
    expect(progress.noButtonDestroyed).toBe(true);
  });

  it("accepting terms completes the introduction", () => {
    const progress = createInitialProgress();
    const next = transition(progress, { type: "TERMS_ACCEPTED" });
    expect(next.termsAccepted).toBe(true);
    expect(next.introCompleted).toBe(true);
  });
});

describe("game-machine: dev tools", () => {
  it("DEV_RESET returns a fresh initial state", () => {
    let progress = createInitialProgress();
    progress = transition(progress, { type: "ERA_SCENE_ADVANCE", era: 1 });
    progress = transition(progress, { type: "DEV_RESET" });
    expect(progress).toEqual(createInitialProgress());
  });

  it("DEV_UNLOCK_ALL unlocks every locked Era", () => {
    const progress = createInitialProgress();
    const next = transition(progress, { type: "DEV_UNLOCK_ALL" });
    for (const era of [1, 2, 3, 4, 5, 6, 7, 8] as const) {
      expect(next.eraStatuses[era]).not.toBe("locked");
    }
  });
});
