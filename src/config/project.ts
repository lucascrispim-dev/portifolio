/**
 * Configuração central do projeto. Edite aqui para personalizar nomes,
 * data e o número de fugas do botão "Não" — nada disso deve precisar ser
 * alterado em outros arquivos.
 */
export const projectConfig = {
  projectName: "PROJECT: NEXT ERA",
  playerOneName: "Lucas",
  /** O nome de verdade. Usado nos momentos sinceros. */
  playerTwoRealName: "Cauã",
  /**
   * A "correção" que o sistema insiste em aplicar. É piada recorrente:
   * o narrador se recusa a aceitar o nome verdadeiro.
   */
  playerTwoJokeName: "Cacau Nazaret",
  startDate: "08.08.2026",
  noButtonAttempts: 8,
  storageKey: "project-next-era-progress",
  /** Total de Eras que o jogo *aparenta* ter. Só as 8 primeiras existem. */
  totalEras: 13,
  longLiveThreshold: 7,
  /** Segurar este tanto no canto da tela final dispara a continuação. */
  finalTriggerHoldMs: 2000,
  /**
   * Rede de segurança: se o toque longo falhar na hora, a continuação
   * acontece sozinha depois disso. Existe para que um gesto errado sob
   * pressão não deixe a tela travada em "Olha para ele.".
   */
  finalTriggerFallbackMs: 4 * 60 * 1000,
};

/** Falas de observação do narrador, disparadas por comportamento real. */
export const observationLines: string[] = [
  "Você clica rápido demais.\nAnotado.",
  "Interessante.",
  "Você não vai encontrar nada aí.",
  "Continua.",
  "Isso foi anotado.",
  "Estou observando.",
];
