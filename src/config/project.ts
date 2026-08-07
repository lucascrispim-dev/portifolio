/**
 * Configuração central do projeto. Edite aqui para personalizar nomes,
 * data simbólica e o número de fugas do botão "Não" — nada disso deve
 * precisar ser alterado em outros arquivos.
 */
export const projectConfig = {
  projectName: "PROJECT: NEXT ERA",
  playerOneName: "Lucas",
  playerTwoName: "Cacau Nazaret",
  symbolicDate: "08/08",
  noButtonAttempts: 8,
  storageKey: "project-next-era-progress",
  /** Total de Eras que o jogo *aparenta* ter. Só as 8 primeiras existem. */
  totalEras: 13,
  /** Número de achievements que destrava o "Long Live". */
  longLiveThreshold: 7,
};

/**
 * Mensagens espontâneas do narrador. Ponto central para novas piadas
 * internas — adicionar itens aqui não altera nenhum texto do roteiro.
 */
export const bonusNarratorLines: string[] = [
  "Curioso.",
  "Tá pensando demais.",
  "Calma. Aproveita o momento.",
  "Eu também faria isso.",
  "Interessante.",
  "Acho que essa foi uma boa escolha.",
  "Não posso contar tudo ainda.",
  "Você vai entender depois.",
  "Ainda não chegou a hora.",
  "Não adianta procurar pistas aqui.",
  "Você realmente é curioso.",
  "Eu avisei que não contaria o final.",
];
