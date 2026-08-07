import { beforeEach, describe, expect, it } from "vitest";
import { transition } from "@/lib/game-machine";
import { consumeRestartRequest, RESTART_TOKEN } from "@/lib/restart";
import { createInitialProgress, loadProgress, saveProgress } from "@/lib/storage";
import { projectConfig } from "@/config/project";
import { PLAYABLE_ERA_IDS } from "@/types/game";
import type { GameProgress } from "@/types/game";

/** Um progresso "no fim de tudo", como fica depois da noite inteira. */
function progressoNoFinal(): GameProgress {
  let progress = createInitialProgress();
  for (const era of PLAYABLE_ERA_IDS) {
    const total = 3;
    for (let i = 0; i < total; i++) {
      progress = transition(progress, { type: "ERA_SCENE_ADVANCE", era });
    }
    progress = transition(progress, { type: "ERA_COMPLETE", era });
  }
  for (const stage of ["confession", "eraXiii", "transferring", "lookAtHim", "answered"] as const) {
    progress = transition(progress, { type: "SET_FINAL_STAGE", stage });
  }
  return transition(progress, {
    type: "ADD_ACHIEVEMENT",
    achievementId: "the-next-era",
  });
}

function irPara(url: string) {
  window.history.replaceState(null, "", url);
}

beforeEach(() => {
  window.localStorage.clear();
  irPara("/");
});

describe("recomeçar do zero", () => {
  /**
   * O jogo é de mão única de propósito. Sem um caminho de volta explícito
   * não dá para testar de novo em produção, onde não existe painel de dev.
   */
  it("RESET devolve o estado inicial mesmo depois do final", () => {
    const fim = progressoNoFinal();
    expect(fim.finalStage).toBe("answered");

    const zerado = transition(fim, { type: "RESET" });
    expect(zerado).toEqual(createInitialProgress());
    expect(zerado.finalStage).toBe("playing");
    expect(zerado.eraStatuses[1]).toBe("available");
    expect(zerado.eraStatuses[2]).toBe("locked");
    expect(zerado.achievements).toEqual([]);
    expect(zerado.patience).toBe(100);
  });

  it("SET_FINAL_STAGE continua sem andar para trás depois do RESET", () => {
    let progress = transition(progressoNoFinal(), { type: "RESET" });
    progress = transition(progress, { type: "SET_FINAL_STAGE", stage: "confession" });
    expect(progress.finalStage).toBe("confession");
    progress = transition(progress, { type: "SET_FINAL_STAGE", stage: "playing" });
    expect(progress.finalStage).toBe("confession");
  });
});

describe("?reiniciar na URL", () => {
  it("apaga o progresso salvo e volta ao começo", () => {
    saveProgress(progressoNoFinal());
    expect(loadProgress().finalStage).toBe("answered");

    irPara(`/?${RESTART_TOKEN}`);
    expect(consumeRestartRequest()).toBe(true);

    expect(window.localStorage.getItem(projectConfig.storageKey)).toBeNull();
    expect(loadProgress()).toEqual(createInitialProgress());
  });

  it("aceita a forma com #, que sobrevive a apps que reescrevem a query", () => {
    saveProgress(progressoNoFinal());
    irPara(`/#${RESTART_TOKEN}`);
    expect(consumeRestartRequest()).toBe(true);
    expect(loadProgress()).toEqual(createInitialProgress());
  });

  /** Sem isso, um F5 depois do reinício apagaria o progresso de novo. */
  it("remove o token da barra de endereço", () => {
    irPara(`/?${RESTART_TOKEN}`);
    consumeRestartRequest();
    expect(window.location.search).not.toContain(RESTART_TOKEN);
    expect(window.location.hash).not.toContain(RESTART_TOKEN);
  });

  it("não toca em nada quando o token não está na URL", () => {
    const fim = progressoNoFinal();
    saveProgress(fim);
    irPara("/");
    expect(consumeRestartRequest()).toBe(false);
    expect(loadProgress()).toEqual(fim);
  });

  it("um parâmetro parecido não dispara o reinício", () => {
    const fim = progressoNoFinal();
    saveProgress(fim);
    irPara("/?reiniciarDepois=1");
    expect(consumeRestartRequest()).toBe(false);
    expect(loadProgress()).toEqual(fim);
  });
});
