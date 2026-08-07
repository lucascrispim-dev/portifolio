import { describe, expect, it } from "vitest";
import {
  eraCatalog,
  eraThirteenTapResponses,
  lockedEraMessage,
} from "@/content/era-catalog";
import { eraDefinitions } from "@/content/eras";
import { PLAYABLE_ERA_IDS } from "@/types/game";

describe("catálogo das 13 Eras", () => {
  it("lista treze Eras", () => {
    expect(eraCatalog).toHaveLength(13);
  });

  it("marca como jogáveis exatamente as oito primeiras", () => {
    const playable = eraCatalog.filter((e) => e.playable).map((e) => e.id);
    expect(playable).toEqual(PLAYABLE_ERA_IDS);
  });

  /**
   * O truque depende disto: as Eras IX a XII precisam parecer conteúdo
   * planejado. Se voltarem a exibir "arquivo não encontrado", o jogador
   * percebe que a história acaba na Era VIII.
   */
  it("as Eras IX a XII têm nomes reais de álbuns", () => {
    const names = eraCatalog
      .filter((e) => e.id >= 9 && e.id <= 12)
      .map((e) => e.title);
    expect(names).toEqual([
      "evermore",
      "Midnights",
      "The Tortured Poets Department",
      "The Life of a Showgirl",
    ]);
    for (const name of names) {
      expect(name.toLowerCase()).not.toContain("não encontrado");
    }
  });

  it("a Era XIII é a única chamada THE NEXT CHAPTER", () => {
    const thirteen = eraCatalog.find((e) => e.id === 13);
    expect(thirteen?.title).toBe("THE NEXT CHAPTER");
    expect(thirteen?.playable).toBe(false);
  });

  it("toda Era jogável do catálogo tem conteúdo de verdade", () => {
    for (const era of PLAYABLE_ERA_IDS) {
      expect(eraDefinitions[era].screens.length).toBeGreaterThan(0);
    }
  });
});

describe("tentativas de abrir a Era XIII", () => {
  it("tem cinco respostas, em ordem", () => {
    expect(eraThirteenTapResponses).toHaveLength(5);
    expect(eraThirteenTapResponses[0][0].text).toContain("pular do capítulo 1");
    expect(eraThirteenTapResponses[1][0].text).toContain("Cacau Nazaret");
    expect(eraThirteenTapResponses[2][0].text).toContain("🖕");
    expect(eraThirteenTapResponses[3][0].text).toContain("Continuar clicando");
    expect(eraThirteenTapResponses[4][0].text).toContain("falta de paciência");
  });

  it("só usa os dois emojis permitidos", () => {
    const todos = eraThirteenTapResponses
      .flat()
      .map((line) => line.text)
      .join(" ");
    expect(todos).not.toContain("☝️");
    expect(todos).not.toContain("😂");
    expect(todos).not.toContain("🙂");
  });
});

describe("mensagem das Eras bloqueadas", () => {
  it("informa que a Era ainda não foi escrita", () => {
    expect(lockedEraMessage("09", "evermore")).toBe(
      "ERA 09 — EVERMORE\nAINDA NÃO ESCRITA"
    );
  });
});
