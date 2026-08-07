import type { EraCatalogEntry, NarratorLine } from "@/types/game";

/**
 * As 13 Eras como o jogador as vê. As Eras IX a XII exibem os nomes reais
 * dos álbuns — e não "arquivo não encontrado" — justamente para que a
 * lista pareça um plano legítimo e não denuncie que o jogo termina na
 * Era VIII (ver docs/roteiro/NOVO-FLUXO-13-ERAS.md, seção 3).
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
  { id: 9, label: "09", title: "evermore", playable: false },
  { id: 10, label: "10", title: "Midnights", playable: false },
  { id: 11, label: "11", title: "The Tortured Poets Department", playable: false },
  { id: 12, label: "12", title: "The Life of a Showgirl", playable: false },
  { id: 13, label: "13", title: "THE NEXT CHAPTER", playable: false },
];

export const eraThirteenCard = {
  eraLabel: "ERA XIII",
  title: "THE NEXT CHAPTER",
  lines: [
    "Esta Era ainda não foi escrita.",
    "Algumas respostas\nsó existem\nno próximo capítulo.",
  ],
};

/**
 * Respostas a cada tentativa de abrir a Era XIII, em ordem. Depois da
 * quinta, a última se repete.
 */
export const eraThirteenTapResponses: NarratorLine[][] = [
  [
    {
      text: "Você está tentando\npular do capítulo 1\ndiretamente para o final.",
      pause: "short",
    },
    { text: "Nem a Taylor lançaria\ntreze álbuns no mesmo dia." },
  ],
  [{ text: "Ainda não,\nCacau Nazaret." }],
  [{ text: "Pode tirar\nesse dedinho daí.\n\n🖕" }],
  [{ text: "Continuar clicando\nnão fará a Era XIII\nchegar mais rápido." }],
  [{ text: "Mas admiro\na falta de paciência." }],
];

/** Mensagem curta ao tocar nas Eras IX a XII. */
export function lockedEraMessage(label: string, title: string): string {
  return `ERA ${label} — ${title.toUpperCase()}\nAINDA NÃO ESCRITA`;
}
