import { era1 } from "@/content/era-1";
import { era2 } from "@/content/era-2";
import { era3 } from "@/content/era-3";
import { era4 } from "@/content/era-4";
import { era5 } from "@/content/era-5";
import { era6 } from "@/content/era-6";
import { era7 } from "@/content/era-7";
import { era8 } from "@/content/era-8";
import type { EraDefinition, EraId } from "@/types/game";

export const eraDefinitions: Record<EraId, EraDefinition> = {
  1: era1,
  2: era2,
  3: era3,
  4: era4,
  5: era5,
  6: era6,
  7: era7,
  8: era8,
};
