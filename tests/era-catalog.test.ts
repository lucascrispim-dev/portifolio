import { describe, expect, it } from "vitest";
import {
  ERA_XIII_SECRET_TAP,
  eraCatalog,
  eraThirteenSecretResponse,
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
   * A direção definitiva pede mistério, não um plano legível: as Eras IX
   * a XII são "???". Um nome real ali entregaria que existe um roteiro
   * escrito além da Era VIII.
   */
  it("as Eras IX a XII são ilegíveis", () => {
    const names = eraCatalog
      .filter((e) => e.id >= 9 && e.id <= 12)
      .map((e) => e.title);
    expect(names).toEqual(["???", "???", "???", "???"]);
  });

  it("a Era XIII é a única nomeada e nunca é jogável", () => {
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
  it("tem oito respostas, em ordem", () => {
    expect(eraThirteenTapResponses).toHaveLength(8);
    expect(eraThirteenTapResponses[0][0].text).toContain("ACESSO NEGADO");
    expect(eraThirteenTapResponses[3][0].text).toContain("Cacau Nazaret");
    expect(eraThirteenTapResponses[4][0].text).toContain("🖕");
    expect(eraThirteenTapResponses[7][0].text).toContain("esperar");
  });

  it("guarda a resposta secreta para a décima terceira tentativa", () => {
    expect(ERA_XIII_SECRET_TAP).toBe(13);
    expect(eraThirteenSecretResponse.length).toBeGreaterThan(0);
  });

  /** 🏆 e 🖕 são os dois únicos emojis permitidos na interface. */
  it("só usa os dois emojis permitidos", () => {
    const todos = [...eraThirteenTapResponses.flat(), ...eraThirteenSecretResponse]
      .map((line) => line.text)
      .join(" ");
    expect(todos).not.toContain("☝️");
    expect(todos).not.toContain("😂");
    expect(todos).not.toContain("🙂");
  });
});

describe("mensagem das Eras bloqueadas", () => {
  it("informa que a Era ainda não foi desenvolvida", () => {
    expect(lockedEraMessage("09")).toBe("ERA 09\nAINDA NÃO DESENVOLVIDA");
  });
});
