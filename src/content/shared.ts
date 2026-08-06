import type { EventConfirmationCopy, NarratorLine } from "@/types/game";

/**
 * Chrome estrutural reutilizado entre as Eras I-VI para a mecânica de
 * confirmação de evento — mesmo texto que a Era I já estabelece para
 * "Ainda não" / "Talvez" / "Agora fiquei em dúvida". Apenas a pergunta,
 * as linhas de reabertura e o rótulo do evento variam por Era, conforme
 * o acontecimento pedido em cada uma (ver docs/roteiro, seção 5 do prompt).
 */
export const standardReopenLines: NarratorLine[] = [
  { text: "Você voltou.", pause: "long" },
  { text: "Vamos ver no que isso deu.", pause: "long" },
];

export const standardNotYetResponse: NarratorLine[] = [
  { text: "Tudo bem.", pause: "short" },
  { text: "Boas histórias\nnão precisam ser apressadas.", pause: "short" },
  { text: "Volte quando tiver\nalgo novo para me contar.", pause: "long" },
];

export const standardMaybeResponse: NarratorLine[] = [
  { text: "Então ainda não terminou.\nVolte quando tiver certeza." },
];

export const standardDoubtResponse: NarratorLine[] = [
  {
    text: "Excelente.\nConsegui confundir você\ncom uma única pergunta.\nTente novamente depois.",
  },
];

export const standardCertainResponse: NarratorLine[] = [
  { text: "Resposta registrada." },
];

export const standardClosingLines: NarratorLine[] = [
  { text: "A próxima Era\njá pode começar.", pause: "long" },
];

export function buildEventConfirmation(overrides: {
  reopenLines?: NarratorLine[];
  question: NarratorLine[];
  eventLabel: string;
  registeredLines: NarratorLine[];
}): EventConfirmationCopy {
  return {
    reopenLines: overrides.reopenLines ?? standardReopenLines,
    question: overrides.question,
    notYetResponse: standardNotYetResponse,
    confirmQuestion: "Tem certeza?",
    maybeResponse: standardMaybeResponse,
    doubtResponse: standardDoubtResponse,
    certainResponse: standardCertainResponse,
    analyzingLabel: "Analisando acontecimento...",
    eventLabel: overrides.eventLabel,
    registeredLines: overrides.registeredLines,
  };
}
