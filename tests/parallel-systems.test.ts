import { describe, expect, it } from "vitest";
import { transition } from "@/lib/game-machine";
import { createInitialProgress } from "@/lib/storage";
import { eraPersonalities } from "@/config/personalities";
import { inventoryItems } from "@/content/inventory";
import { permanentlyLockedFileId, secretFiles } from "@/content/secret-files";
import { systemErrors } from "@/content/system-errors";
import { eraDefinitions } from "@/content/eras";
import { PLAYABLE_ERA_IDS } from "@/types/game";
import type { EraScreen, PlayableEraId } from "@/types/game";

/** Todas as telas de todas as Eras, achatadas. */
const allScreens: EraScreen[] = PLAYABLE_ERA_IDS.flatMap(
  (era) => eraDefinitions[era].screens
);

function screensOfKind<K extends EraScreen["kind"]>(
  kind: K
): Extract<EraScreen, { kind: K }>[] {
  return allScreens.filter((s): s is Extract<EraScreen, { kind: K }> => s.kind === kind);
}

describe("inventário", () => {
  it("todo item referenciado por uma tela existe no catálogo", () => {
    const known = new Set(inventoryItems.map((item) => item.id));
    for (const screen of screensOfKind("item")) {
      expect(known.has(screen.itemId), `item desconhecido: ${screen.itemId}`).toBe(
        true
      );
    }
  });

  it("nenhum item é entregue duas vezes por tela", () => {
    const ids = screensOfKind("item").map((s) => s.itemId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  /**
   * O pagamento do final depende disto: os onze itens aparecem juntos na
   * última tela e formam a história em ordem. Um item que nunca é
   * entregue deixa um buraco naquela sequência.
   */
  it("todo item do catálogo é entregue em algum lugar do jogo", () => {
    const fromScreens = new Set(screensOfKind("item").map((s) => s.itemId));
    // Três itens são entregues pelos próprios minijogos, porque neles o
    // item é o desfecho da partida e não um beat separado.
    const fromMinigames = new Set([
      "controle-toy-story",
      "recorte-de-jornal",
      "fio-invisivel",
    ]);
    for (const item of inventoryItems) {
      expect(
        fromScreens.has(item.id) || fromMinigames.has(item.id),
        `item nunca entregue: ${item.id}`
      ).toBe(true);
    }
  });

  it("COLLECT_ITEM não duplica e preserva a ordem de coleta", () => {
    let progress = createInitialProgress();
    progress = transition(progress, { type: "COLLECT_ITEM", itemId: "pizza" });
    progress = transition(progress, { type: "COLLECT_ITEM", itemId: "leite" });
    progress = transition(progress, { type: "COLLECT_ITEM", itemId: "pizza" });
    expect(progress.inventory).toEqual(["pizza", "leite"]);
  });
});

describe("arquivos secretos", () => {
  it("todo arquivo referenciado por uma tela existe no catálogo", () => {
    const known = new Set(secretFiles.map((file) => file.id));
    for (const screen of screensOfKind("file")) {
      expect(known.has(screen.fileId), `arquivo desconhecido: ${screen.fileId}`).toBe(
        true
      );
    }
  });

  /**
   * O ARQUIVO 013 é a única promessa que o jogo não cumpre dentro das
   * oito Eras — ele fica visível na lista do menu e nunca abre. Se
   * alguma tela passar a entregá-lo, a coleção deixa de ser incompleta
   * de propósito.
   */
  it("o arquivo bloqueado nunca é entregue por nenhuma tela", () => {
    const delivered = screensOfKind("file").map((s) => s.fileId);
    expect(delivered).not.toContain(permanentlyLockedFileId);
  });

  it("UNLOCK_FILE não duplica", () => {
    let progress = createInitialProgress();
    progress = transition(progress, { type: "UNLOCK_FILE", fileId: "arquivo-001" });
    progress = transition(progress, { type: "UNLOCK_FILE", fileId: "arquivo-001" });
    expect(progress.files).toEqual(["arquivo-001"]);
  });
});

describe("falhas do sistema", () => {
  it("toda interrupção referencia um erro catalogado", () => {
    for (const screen of screensOfKind("interrupt")) {
      expect(systemErrors[screen.error]).toBeDefined();
    }
  });

  /**
   * Um erro catalogado que nenhuma Era usa é uma piada escrita e nunca
   * contada. Se um deles sobrar aqui, ou falta posicioná-lo numa Era ou
   * ele não devia existir.
   */
  it("toda falha catalogada é usada em alguma Era", () => {
    const used = new Set(screensOfKind("interrupt").map((s) => s.error));
    for (const id of Object.keys(systemErrors)) {
      expect(used.has(id as keyof typeof systemErrors), `falha nunca exibida: ${id}`).toBe(
        true
      );
    }
  });

  /** O ERRO 13 é grande demais para ser um susto: tem sequência própria. */
  it("o ERRO 13 não está no catálogo de sustos", () => {
    const codes = Object.values(systemErrors).map((e) => e.code);
    expect(codes).not.toContain("ERRO 13");
  });

  it("toda falha se resolve e tem o que dizer depois", () => {
    for (const spec of Object.values(systemErrors)) {
      expect(spec.resolution.length).toBeGreaterThan(0);
      expect(spec.after.length).toBeGreaterThan(0);
    }
  });

  it("COUNT_ERROR e COUNT_ANSWER acumulam nas estatísticas", () => {
    let progress = createInitialProgress();
    expect(progress.stats).toEqual({ answers: 0, errors: 0 });
    progress = transition(progress, { type: "COUNT_ANSWER" });
    progress = transition(progress, { type: "COUNT_ANSWER" });
    progress = transition(progress, { type: "COUNT_ERROR" });
    expect(progress.stats).toEqual({ answers: 2, errors: 1 });
  });
});

describe("personalidade das Eras", () => {
  it("cada Era jogável tem personalidade própria", () => {
    for (const era of PLAYABLE_ERA_IDS) {
      expect(eraPersonalities[era]).toBeDefined();
    }
  });

  /**
   * Se duas Eras compartilharem o mesmo rótulo de sistema, o jogador
   * perde o sinal mais constante de que trocou de mundo.
   */
  it("nenhum rótulo de sistema se repete entre Eras", () => {
    const labels = PLAYABLE_ERA_IDS.map((era) => eraPersonalities[era].systemLabel);
    expect(new Set(labels).size).toBe(labels.length);
  });

  it("o ritmo de digitação muda ao longo do jogo", () => {
    const speeds = PLAYABLE_ERA_IDS.map(
      (era) => eraPersonalities[era].typeSpeedMs
    );
    expect(new Set(speeds).size).toBeGreaterThan(1);
    // folklore é a Era silenciosa: precisa ser a mais lenta de todas.
    expect(Math.max(...speeds)).toBe(eraPersonalities[8].typeSpeedMs);
    // Fearless é a apressada.
    expect(Math.min(...speeds)).toBe(eraPersonalities[2].typeSpeedMs);
  });

  it("toda Era tem pelo menos um evento ambiente", () => {
    for (const era of PLAYABLE_ERA_IDS) {
      expect(eraPersonalities[era as PlayableEraId].ambient.length).toBeGreaterThan(0);
    }
  });
});
