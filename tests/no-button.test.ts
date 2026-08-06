import { describe, expect, it } from "vitest";
import {
  NO_BUTTON_MESSAGES,
  NO_BUTTON_TOTAL_ATTEMPTS,
  isWithinSafeBounds,
  pickEscapePosition,
  resolveNoButtonTap,
} from "@/lib/no-button";

describe("no-button: escape positions", () => {
  it("keeps every one of the 7 escape positions within the safe area", () => {
    for (let attemptIndex = 0; attemptIndex < 7; attemptIndex++) {
      const position = pickEscapePosition(attemptIndex);
      expect(isWithinSafeBounds(position)).toBe(true);
    }
  });

  it("has exactly one message per escape (7), for 8 total attempts", () => {
    expect(NO_BUTTON_MESSAGES).toHaveLength(NO_BUTTON_TOTAL_ATTEMPTS - 1);
  });
});

describe("no-button: tap resolution", () => {
  it("escapes on attempts 1 through 7", () => {
    for (let attemptsSoFar = 0; attemptsSoFar < 7; attemptsSoFar++) {
      const outcome = resolveNoButtonTap(attemptsSoFar);
      expect(outcome.kind).toBe("escaped");
      expect(outcome.attempts).toBe(attemptsSoFar + 1);
      if (outcome.kind === "escaped") {
        expect(outcome.message).toBe(NO_BUTTON_MESSAGES[attemptsSoFar]);
        expect(isWithinSafeBounds(outcome.position)).toBe(true);
      }
    }
  });

  it("explodes on the 8th attempt instead of escaping again", () => {
    const outcome = resolveNoButtonTap(7);
    expect(outcome.kind).toBe("destroyed");
    expect(outcome.attempts).toBe(8);
  });

  it("never escapes past the 8th attempt", () => {
    const outcome = resolveNoButtonTap(20);
    expect(outcome.kind).toBe("destroyed");
  });
});
