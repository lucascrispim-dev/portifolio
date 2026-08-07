/**
 * A "PACIÊNCIA DE CACAU" começa em 100 e só desce — em múltiplos de 13,
 * como todo número deste jogo. Cada gatilho do roteiro (uma estrela que
 * foge, um banheiro trancado, um labirinto que volta ao início) empurra o
 * contador um degrau abaixo. Não existe caminho de volta: chegar em 0 é
 * o objetivo declarado do narrador.
 */
export const PATIENCE_STEPS = [100, 87, 74, 61, 48, 35, 22, 13, 0] as const;

export const INITIAL_PATIENCE = PATIENCE_STEPS[0];

/** O próximo degrau abaixo do valor atual. Em 0, permanece em 0. */
export function nextPatienceValue(current: number): number {
  const below = PATIENCE_STEPS.filter((step) => step < current);
  return below.length > 0 ? below[0] : 0;
}
