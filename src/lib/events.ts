import type { EraId, NarrativeEvent } from "@/types/game";

/**
 * Mapa Era -> evento narrativo interno que a conclui. Identificadores
 * internos, nunca exibidos ao jogador. Era VII conclui automaticamente
 * (sem gate de acontecimento offline, ver docs/roteiro/ERA VII) e a
 * Era VIII é terminal — nenhuma das duas usa um evento de confirmação
 * do tipo "waiting_for_event".
 */
export const eraCompletionEvent: Partial<Record<EraId, NarrativeEvent>> = {
  1: "NEW_MEMORY_CONFIRMED",
  2: "SHARED_MOMENT_CONFIRMED",
  3: "MOVIE_EXPERIENCE_CONFIRMED",
  4: "CONVERSATION_CONFIRMED",
  5: "ANOTHER_MEMORY_CONFIRMED",
  6: "PRIVATE_MOMENT_CONFIRMED",
};

/** Eras que passam pelo gate de acontecimento real (`waiting_for_event`). */
export function hasEventGate(era: EraId): boolean {
  return eraCompletionEvent[era] !== undefined;
}
