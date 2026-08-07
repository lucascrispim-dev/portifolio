import { describe, expect, it } from "vitest";
import { transition } from "@/lib/game-machine";
import { createInitialProgress } from "@/lib/storage";
import { eraCountLabel } from "@/content/era-catalog";
import { eraThreeLeak } from "@/config/personalities";
import { termsItems } from "@/content/introduction";
import { eraDefinitions } from "@/content/eras";
import { PLAYABLE_ERA_IDS } from "@/types/game";
import type { EraScreen, PlayableEraId } from "@/types/game";

/**
 * A Era XIII é a única coisa que o jogo tem para o jogador descobrir
 * sozinho. Estes testes protegem a ordem em que isso acontece — mencioná-la
 * cedo demais transformaria as oito Eras numa contagem regressiva.
 */

function screensOf(era: PlayableEraId): EraScreen[] {
  return eraDefinitions[era].screens;
}

/** Todo texto exibido por uma tela, achatado, para busca de menções. */
function textOf(screen: EraScreen): string {
  const parts: string[] = [];
  const push = (value: unknown) => {
    if (typeof value === "string") parts.push(value);
  };

  const record = screen as unknown as Record<string, unknown>;
  for (const value of Object.values(record)) {
    push(value);
    if (Array.isArray(value)) {
      for (const entry of value) {
        push(entry);
        if (entry && typeof entry === "object") {
          for (const inner of Object.values(entry as Record<string, unknown>)) {
            push(inner);
            if (Array.isArray(inner)) inner.forEach(push);
          }
        }
      }
    }
  }
  return parts.join(" ");
}

describe("descoberta da Era XIII", () => {
  it("começa desconhecida", () => {
    expect(createInitialProgress().eraXiiiDiscovered).toBe(false);
  });

  it("DISCOVER_ERA_XIII é irreversível e idempotente", () => {
    let progress = createInitialProgress();
    progress = transition(progress, { type: "DISCOVER_ERA_XIII" });
    expect(progress.eraXiiiDiscovered).toBe(true);

    const again = transition(progress, { type: "DISCOVER_ERA_XIII" });
    expect(again).toBe(progress);

    // Nem o falso reset desfaz o que ele já viu.
    const afterReset = transition(progress, {
      type: "SET_FAKE_RESET_STAGE",
      stage: "revealed",
    });
    expect(afterReset.eraXiiiDiscovered).toBe(true);
  });

  it("o mapa conta doze Eras antes e treze depois", () => {
    expect(eraCountLabel(false)).toContain("12");
    expect(eraCountLabel(true)).toContain("13");
  });

  /** O vazamento é o único caminho: sem essa tela, ninguém descobre. */
  it("a Era III tem exatamente uma tela de vazamento", () => {
    const leaks = screensOf(3).filter((s) => s.kind === "leak");
    expect(leaks).toHaveLength(1);
  });

  it("nenhuma outra Era tem tela de vazamento", () => {
    for (const era of PLAYABLE_ERA_IDS) {
      if (era === 3) continue;
      expect(screensOf(era).some((s) => s.kind === "leak")).toBe(false);
    }
  });

  it("o vazamento revela e censura a mesma frase", () => {
    expect(eraThreeLeak.leaked).toContain("Era XIII");
    // A censura precisa cobrir o que importa, não a frase inteira.
    expect(eraThreeLeak.redacted).not.toContain("XIII");
    expect(eraThreeLeak.redacted).toContain("█");
  });

  it("o mapa é revisitado logo depois do vazamento", () => {
    const era3 = screensOf(3);
    const leakIndex = era3.findIndex((s) => s.kind === "leak");
    const mapIndex = era3.findIndex(
      (s, i) => i > leakIndex && s.kind === "progressMap"
    );
    expect(mapIndex).toBe(leakIndex + 1);
  });

  /**
   * A regra central: nada nas Eras I e II — nem os termos de uso da
   * introdução — pode citar a Era XIII, porque nesse ponto ela ainda não
   * existe para o jogador.
   */
  it("nada antes do vazamento menciona a Era XIII", () => {
    const antes = [
      ...termsItems,
      ...screensOf(1).map(textOf),
      ...screensOf(2).map(textOf),
      // Na Era III, só até o vazamento.
      ...screensOf(3)
        .slice(0, screensOf(3).findIndex((s) => s.kind === "leak"))
        .map(textOf),
    ].join(" ");

    expect(antes).not.toContain("Era XIII");
    expect(antes).not.toContain("ERA XIII");
  });

  it("depois do vazamento o jogo pode falar dela à vontade", () => {
    const depois = [4, 6, 8]
      .flatMap((era) => screensOf(era as PlayableEraId))
      .map(textOf)
      .join(" ");
    expect(depois).toContain("ERA XIII");
  });

  it("pular direto para uma Era posterior no ensaio já mostra a Era XIII", () => {
    const progress = createInitialProgress();
    expect(transition(progress, { type: "DEV_SET_ERA", era: 2 }).eraXiiiDiscovered).toBe(
      false
    );
    expect(transition(progress, { type: "DEV_SET_ERA", era: 5 }).eraXiiiDiscovered).toBe(
      true
    );
  });
});
