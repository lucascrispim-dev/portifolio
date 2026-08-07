import { describe, expect, it } from "vitest";
import { transition } from "@/lib/game-machine";
import { createInitialProgress, SCHEMA_VERSION } from "@/lib/storage";
import { nextPatienceValue } from "@/lib/patience";
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
    expect(progress.fakeResetStage).toBe("none");
    expect(progress.patience).toBe(100);
    expect(progress.schemaVersion).toBe(SCHEMA_VERSION);
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

  /** Nem a confissão nem a Era XIII destravam o mapa: ele fica como está. */
  it("continuam trancadas durante toda a sequência final", () => {
    let progress = createInitialProgress();
    for (const era of PLAYABLE_ERA_IDS) {
      progress = playEra(progress, era);
    }
    for (const stage of ["confession", "eraXiii", "transferring", "lookAtHim", "answered"] as const) {
      progress = transition(progress, { type: "SET_FINAL_STAGE", stage });
      for (const era of PHANTOM_ERAS) {
        expect(progress.eraStatuses[era]).toBe("locked");
      }
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
    progress = transition(progress, { type: "ADD_ACHIEVEMENT", achievementId: "mijao" });
    progress = transition(progress, { type: "ADD_ACHIEVEMENT", achievementId: "mijao" });
    progress = transition(progress, { type: "ADD_EASTER_EGG", id: "the-1" });
    progress = transition(progress, { type: "ADD_EASTER_EGG", id: "the-1" });
    expect(progress.achievements).toEqual(["mijao"]);
    expect(progress.easterEggs).toEqual(["the-1"]);
  });

  it("guarda respostas abertas por pergunta", () => {
    let progress = createInitialProgress();
    progress = transition(progress, {
      type: "SET_OPEN_ANSWER",
      questionId: "nome",
      text: "Cauã",
    });
    progress = transition(progress, {
      type: "SET_OPEN_ANSWER",
      questionId: "o-que-sente",
      text: "paz",
    });
    expect(progress.openAnswers).toEqual({ nome: "Cauã", "o-que-sente": "paz" });
  });

  it("guarda a escolha secreta do Lucas sem revelá-la", () => {
    const next = transition(createInitialProgress(), {
      type: "SET_LUCAS_CHOICE",
      choice: "B",
    });
    expect(next.lucasChoice).toBe("B");
  });
});

describe("paciência", () => {
  it("desce em degraus e nunca sobe", () => {
    let progress = createInitialProgress();
    progress = transition(progress, { type: "LOSE_PATIENCE", to: 61 });
    expect(progress.patience).toBe(61);

    // Um valor maior é simplesmente ignorado: o contador é de mão única.
    progress = transition(progress, { type: "LOSE_PATIENCE", to: 90 });
    expect(progress.patience).toBe(61);

    progress = transition(progress, { type: "LOSE_PATIENCE", to: 0 });
    expect(progress.patience).toBe(0);
  });

  it("a tabela de degraus só anda para baixo e termina em zero", () => {
    let value = 100;
    const seen: number[] = [];
    for (let i = 0; i < 20; i++) {
      const next = nextPatienceValue(value);
      expect(next).toBeLessThanOrEqual(value);
      value = next;
      seen.push(next);
    }
    expect(value).toBe(0);
    expect(seen[0]).toBeLessThan(100);
  });
});

describe("falso reset", () => {
  /**
   * O ERRO 13 é encenação. Se ele apagasse progresso de verdade, fechar o
   * navegador na hora errada arruinaria a noite.
   */
  it("não apaga nada do progresso real", () => {
    let progress = createInitialProgress();
    progress = playEra(progress, 1);
    progress = playEra(progress, 2);
    progress = transition(progress, {
      type: "ADD_ACHIEVEMENT",
      achievementId: "enchanted",
    });

    const before = progress;
    progress = transition(progress, { type: "SET_FAKE_RESET_STAGE", stage: "erro13" });
    progress = transition(progress, { type: "SET_FAKE_RESET_STAGE", stage: "replaying" });
    progress = transition(progress, { type: "SET_FAKE_RESET_STAGE", stage: "revealed" });

    expect(progress.fakeResetStage).toBe("revealed");
    expect({ ...progress, fakeResetStage: before.fakeResetStage }).toEqual(before);
  });

  it("sobrevive a um recarregamento no meio do susto", () => {
    let progress = createInitialProgress();
    progress = playEra(progress, 1);
    progress = transition(progress, { type: "SET_FAKE_RESET_STAGE", stage: "replaying" });

    // HYDRATE é o que acontece ao abrir a página de novo.
    const reloaded = transition(createInitialProgress(), {
      type: "HYDRATE",
      progress,
    });
    expect(reloaded.fakeResetStage).toBe("replaying");
    expect(reloaded.eraStatuses[1]).toBe("completed");
  });
});

describe("sequência final", () => {
  it("avança de playing até answered", () => {
    let progress = createInitialProgress();
    for (const stage of ["confession", "eraXiii", "transferring", "lookAtHim", "answered"] as const) {
      progress = transition(progress, { type: "SET_FINAL_STAGE", stage });
      expect(progress.finalStage).toBe(stage);
    }
  });

  /** Recarregar a página não pode devolver ninguém para antes da confissão. */
  it("nunca volta atrás", () => {
    let progress = createInitialProgress();
    progress = transition(progress, { type: "SET_FINAL_STAGE", stage: "lookAtHim" });
    progress = transition(progress, { type: "SET_FINAL_STAGE", stage: "confession" });
    expect(progress.finalStage).toBe("lookAtHim");
    progress = transition(progress, { type: "SET_FINAL_STAGE", stage: "playing" });
    expect(progress.finalStage).toBe("lookAtHim");
  });

  it("o painel de dev pode voltar, para ensaiar", () => {
    let progress = createInitialProgress();
    progress = transition(progress, { type: "SET_FINAL_STAGE", stage: "answered" });
    progress = transition(progress, { type: "DEV_SET_FINAL_STAGE", stage: "lookAtHim" });
    expect(progress.finalStage).toBe("lookAtHim");
  });
});
