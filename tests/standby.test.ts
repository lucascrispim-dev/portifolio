import { describe, expect, it } from "vitest";
import { transition } from "@/lib/game-machine";
import { createInitialProgress } from "@/lib/storage";
import type { EraId } from "@/types/game";

/**
 * Reproduz a regra de standby que o GameScreen aplica: a tela mínima de
 * espera aparece enquanto a Era entrou em `waiting_for_event` *nesta
 * mesma "reabertura"*. Quando o jogador guarda o celular e volta
 * (reopenCount avança) — ou quando recarrega a página, o que zera o mapa
 * de sessão — a confirmação do acontecimento assume.
 *
 * A derivação é intencionalmente idêntica à do componente, para que a
 * regra fique coberta por teste sem precisar montar a árvore React.
 */
function isStandby(
  standbyEnteredAt: Partial<Record<EraId, number>>,
  era: EraId,
  reopenCount: number,
  isWaiting: boolean
): boolean {
  return isWaiting && standbyEnteredAt[era] === reopenCount;
}

describe("standby: entrar em espera", () => {
  it("mostra o standby (e não a pergunta) logo após aceitar a missão", () => {
    const progress = transition(
      transition(createInitialProgress(), { type: "ERA_SCENE_ADVANCE", era: 1 }),
      { type: "ERA_ENTER_WAITING", era: 1 }
    );
    const reopenCount = 0;
    const standbyEnteredAt: Partial<Record<EraId, number>> = { 1: reopenCount };

    expect(progress.eraStatuses[1]).toBe("waiting_for_event");
    expect(isStandby(standbyEnteredAt, 1, reopenCount, true)).toBe(true);
  });
});

describe("standby: sair da espera", () => {
  it("uma reabertura (guardou o celular e voltou) leva à confirmação", () => {
    const standbyEnteredAt: Partial<Record<EraId, number>> = { 1: 0 };
    // reopenCount avança de 0 para 1 quando o documento volta a ficar visível.
    expect(isStandby(standbyEnteredAt, 1, 1, true)).toBe(false);
  });

  it("um reload (sessão nova, mapa vazio) vai direto para a confirmação", () => {
    const standbyEnteredAt: Partial<Record<EraId, number>> = {};
    expect(isStandby(standbyEnteredAt, 1, 0, true)).toBe(false);
  });

  it('o "Voltei." manual encerra o standby sem depender de reabertura', () => {
    const STANDBY_DISMISSED = -1;
    const standbyEnteredAt: Partial<Record<EraId, number>> = {
      1: STANDBY_DISMISSED,
    };
    expect(isStandby(standbyEnteredAt, 1, 0, true)).toBe(false);
  });

  it("não mostra standby quando a Era nem está esperando um acontecimento", () => {
    const standbyEnteredAt: Partial<Record<EraId, number>> = { 1: 0 };
    expect(isStandby(standbyEnteredAt, 1, 0, false)).toBe(false);
  });
});

describe("standby: independência entre Eras", () => {
  it("uma Era que entra em espera depois de uma reabertura não herda o sinal antigo", () => {
    // Jogador já reabriu uma vez (reopenCount = 1) e agora aceita a missão
    // da Era 2 — ela precisa ficar em standby, não pular para a pergunta.
    const reopenCount = 1;
    const standbyEnteredAt: Partial<Record<EraId, number>> = {
      1: 0,
      2: reopenCount,
    };
    expect(isStandby(standbyEnteredAt, 2, reopenCount, true)).toBe(true);
    expect(isStandby(standbyEnteredAt, 1, reopenCount, true)).toBe(false);
  });
});
