import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { pace, REDUCED_MOTION_FLOOR_MS } from "@/lib/pacing";

/**
 * Quem liga `prefers-reduced-motion` pediu menos animação, não menos
 * tempo para ler.
 *
 * Numa tela com botão isso não faz diferença — o jogador controla o
 * ritmo, e por isso a narração comum continua sem piso. Mas nas
 * sequências que avançam sozinhas não existe botão para voltar: sem um
 * piso de leitura, a confissão, a declaração do Lucas e a revelação do
 * inventário piscavam e sumiam. A parte mais importante do projeto
 * passava em branco justamente para quem precisa de mais tempo, não de
 * menos.
 */

describe("piso de leitura", () => {
  it("encolhe o tempo sob movimento reduzido, mas nunca abaixo do legível", () => {
    expect(pace(3000, false)).toBe(3000);
    expect(pace(3000, true)).toBe(1500);
    expect(pace(500, true)).toBe(REDUCED_MOTION_FLOOR_MS);
    expect(pace(1100, true)).toBe(REDUCED_MOTION_FLOOR_MS);
  });
});

/**
 * Nestes três arquivos **toda** narração avança sozinha — não há um único
 * botão de continuar. Portanto toda `NarratorText` deles precisa de
 * `readingPace`. Contar as ocorrências é grosseiro, mas é exatamente a
 * invariante que importa, e falha alto no dia em que alguém acrescentar
 * uma fala nova sem o piso.
 */
const AUTO_ADVANCING = [
  "src/components/game/ConfessionSequence.tsx",
  "src/components/game/EraThirteenSequence.tsx",
  "src/components/game/AfterYesSequence.tsx",
];

describe("sequências que avançam sozinhas", () => {
  it.each(AUTO_ADVANCING)("%s pede piso de leitura em toda narração", (file) => {
    const source = readFileSync(file, "utf8");
    const narrators = source.match(/<NarratorText\b/g) ?? [];
    const paced = source.match(/\breadingPace\b/g) ?? [];
    expect(narrators.length).toBeGreaterThan(0);
    expect(paced.length).toBe(narrators.length);
  });
});
