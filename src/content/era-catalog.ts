import { projectConfig } from "@/config/project";
import type { EraCatalogEntry, NarratorLine } from "@/types/game";

/**
 * As 13 Eras como o jogador as vê. As Eras IX a XII aparecem como "???"
 * — a direção definitiva pede mistério, não um plano legível — e a
 * Era XIII fica CLASSIFICADO, pulsando, como a promessa que sustenta o
 * jogo inteiro (ver docs/roteiro/DIRECAO-DEFINITIVA.md).
 */
export const eraCatalog: EraCatalogEntry[] = [
  { id: 1, label: "01", title: "Begin Again", playable: true },
  { id: 2, label: "02", title: "Fearless", playable: true },
  { id: 3, label: "03", title: "Speak Now", playable: true },
  { id: 4, label: "04", title: "Red", playable: true },
  { id: 5, label: "05", title: "1989", playable: true },
  { id: 6, label: "06", title: "reputation", playable: true },
  { id: 7, label: "07", title: "Lover", playable: true },
  { id: 8, label: "08", title: "folklore", playable: true },
  { id: 9, label: "09", title: "???", playable: false },
  { id: 10, label: "10", title: "???", playable: false },
  { id: 11, label: "11", title: "???", playable: false },
  { id: 12, label: "12", title: "???", playable: false },
  { id: 13, label: "13", title: "THE NEXT ERA", playable: false },
];

export const eraThirteenCard = {
  eraLabel: "ERA XIII",
  title: "THE NEXT ERA",
  status: "CLASSIFICADO",
};

/**
 * Respostas a cada tentativa de abrir a Era XIII, em ordem. A partir da
 * oitava a última se repete, até a décima terceira — que premia quem
 * teve paciência de contar.
 */
export const eraThirteenTapResponses: NarratorLine[][] = [
  [{ text: "ACESSO NEGADO." }],
  [{ text: "Não." }],
  [{ text: "Cacau." }],
  [{ text: projectConfig.playerTwoJokeName + "." }],
  [{ text: "Olha esse dedinho.\n\n🖕" }],
  [{ text: "Ele não descansa." }],
  [{ text: "Nem a Taylor lançou\na próxima Era ainda." }],
  [{ text: "Você vai ter\nque esperar." }],
];

/** Na décima terceira tentativa, o sistema finalmente cede. */
export const ERA_XIII_SECRET_TAP = 13;

export const eraThirteenSecretResponse: NarratorLine[] = [
  { text: "...", pause: "short" },
  { text: "Você contou?", pause: "short" },
  { text: "Interessante.", pause: "long" },
];

export const eraThirteenSecretAchievement = {
  id: "thirteen",
  title: "THIRTEEN",
};

/** Mensagem curta ao tocar nas Eras IX a XII. */
export function lockedEraMessage(label: string): string {
  return `ERA ${label}\nAINDA NÃO DESENVOLVIDA`;
}
