import { projectConfig } from "@/config/project";
import type { NarratorLine } from "@/types/game";

/**
 * O texto do final. Fica isolado aqui porque é a única parte do projeto
 * que precisa ser lida e ajustada com calma — é a sua declaração, não
 * uma fala do narrador.
 */

export const confessionIntro: NarratorLine[] = [
  { text: "Antes de ir.", pause: "long" },
  { text: "Preciso confessar uma coisa.", pause: "long" },
];

export const confessionNarrator: NarratorLine[] = [
  {
    text: "Eu passei oito Eras\nfalando como se estivesse\nobservando vocês.",
    pause: "long",
  },
  { text: "Fiz perguntas.", pause: "short" },
  { text: "Fiz piadas.", pause: "short" },
  { text: "Escondi coisas.", pause: "short" },
  {
    text: `E claramente\ntestei a paciência\nde ${projectConfig.playerTwoJokeName}.`,
    pause: "long",
  },
  { text: "Mas algumas coisas\nque eu disse\nnão vieram de mim.", pause: "long" },
];

/** A migração da autoria: o narrador some e sobra você. */
export const dataOriginSteps: { narrator: number; lucas: number }[] = [
  { narrator: 71, lucas: 29 },
  { narrator: 54, lucas: 46 },
  { narrator: 31, lucas: 69 },
  { narrator: 0, lucas: 100 },
];

export const transitionToFirstPerson: NarratorLine[] = [
  { text: "Na verdade...", pause: "long" },
  { text: "eu sempre soube\npor que fiz tudo isso.", pause: "long" },
];

/**
 * A partir daqui não é mais o narrador. É o Lucas.
 * Edite este bloco à vontade — é a única parte que precisa soar como você.
 */
export const declaration: NarratorLine[] = [
  { text: "Eu admiro muito\no quanto você se esforça.", pause: "long" },
  { text: "A sua dedicação.", pause: "short" },
  {
    text: "O jeito que você\nleva as coisas a sério\nquando importa.",
    pause: "long",
  },
  {
    text: "E principalmente...\neu gosto da forma\ncomo me sinto\nquando estou com você.",
    pause: "long",
  },
  { text: "Eu me sinto acolhido.", pause: "short" },
  { text: "Eu me sinto bem.", pause: "long" },
  {
    text: "E talvez eu não saiba\nexplicar perfeitamente\nquando isso aconteceu.",
    pause: "long",
  },
  { text: "Mas eu sei\no que você virou\npara mim.", pause: "long" },
  { text: "Você é o homem\nda minha vida.", pause: "long" },
];

export const eraThirteenAttempt: NarratorLine[] = [
  { text: "Esta pergunta\nnão pode ser feita\npor mim.", pause: "long" },
  { text: "Eu consigo escrever código.", pause: "short" },
  { text: "Criar Eras.", pause: "short" },
  {
    text: `Fazer ${projectConfig.playerTwoJokeName}\nandar atrás de botão.`,
    pause: "short",
  },
  { text: "Fazer você achar\nque perdeu tudo.", pause: "long" },
  { text: "Mas essa parte...\nprecisa acontecer\nfora da tela.", pause: "long" },
];

export const afterYesLines: NarratorLine[] = [
  { text: "O 1%\nnunca foi um cálculo.", pause: "short" },
  { text: "Era uma resposta.", pause: "long" },
];

export const closingLines: NarratorLine[] = [
  { text: "Call It What You Want.", pause: "long" },
  { text: "Eu já sei\ncomo quero chamar.", pause: "long" },
];
