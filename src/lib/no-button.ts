/**
 * Lógica pura do botão "Não" — mantida fora do componente para ser
 * testável sem DOM. Tentativas 1-7 fogem para uma posição nova (dentro
 * da área segura da tela); a 8ª tentativa não foge — o toque explode o
 * botão. Ver docs/roteiro/PROJECT_ NEXT ERA (1).md, seção 4.
 */

export type EscapePosition = { xPercent: number; yPercent: number };

export const NO_BUTTON_TOTAL_ATTEMPTS = 8;

export const NO_BUTTON_MESSAGES: string[] = [
  "Boa tentativa.",
  "Ainda não.",
  "Achei que fosse\nmais esperto.",
  "Não estraga\nmeu roteiro.",
  "Você realmente achou\nque eu colocaria\nessa opção funcionando?",
  "Esse botão tem\na mesma utilidade\nque um guarda-chuva\nembaixo d'água.",
  "Insistente...\n\nRespeito.",
];

/** Margem mínima em relação às bordas e às áreas reservadas para os outros botões. */
const SAFE_MARGIN_PERCENT = 10;
const RESERVED_TOP_PERCENT = 18;
const RESERVED_BOTTOM_PERCENT = 32;

const ESCAPE_PATTERN: EscapePosition[] = [
  { xPercent: 72, yPercent: 30 },
  { xPercent: 18, yPercent: 42 },
  { xPercent: 65, yPercent: 55 },
  { xPercent: 25, yPercent: 26 },
  { xPercent: 78, yPercent: 46 },
  { xPercent: 15, yPercent: 60 },
  { xPercent: 55, yPercent: 34 },
];

/** `attemptIndex` é 0-based (0 = primeira tentativa). Válido para 0..6. */
export function pickEscapePosition(attemptIndex: number): EscapePosition {
  return ESCAPE_PATTERN[attemptIndex % ESCAPE_PATTERN.length];
}

export function isWithinSafeBounds(position: EscapePosition): boolean {
  return (
    position.xPercent >= SAFE_MARGIN_PERCENT &&
    position.xPercent <= 100 - SAFE_MARGIN_PERCENT &&
    position.yPercent >= RESERVED_TOP_PERCENT &&
    position.yPercent <= 100 - RESERVED_BOTTOM_PERCENT
  );
}

export type NoButtonOutcome =
  | { kind: "escaped"; position: EscapePosition; message: string; attempts: number }
  | { kind: "destroyed"; attempts: number };

/** `attemptsSoFar` = número de toques já registrados antes deste toque. */
export function resolveNoButtonTap(attemptsSoFar: number): NoButtonOutcome {
  const attempts = attemptsSoFar + 1;
  if (attemptsSoFar < NO_BUTTON_MESSAGES.length) {
    return {
      kind: "escaped",
      position: pickEscapePosition(attemptsSoFar),
      message: NO_BUTTON_MESSAGES[attemptsSoFar],
      attempts,
    };
  }
  return { kind: "destroyed", attempts };
}
