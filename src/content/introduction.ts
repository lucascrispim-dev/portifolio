import { projectConfig } from "@/config/project";
import type { NarratorLine } from "@/types/game";

export const bootLines: NarratorLine[] = [
  { text: "Inicializando...\n██████████████", pause: "short" },
  { text: "Conexão estabelecida.", pause: "short" },
  { text: "Projeto localizado.", pause: "long" },
];

export const bootTitle = projectConfig.projectName;

export const classificationHeader = "CLASSIFICAÇÃO\nCONFIDENCIAL";

export const classificationAccessLines: NarratorLine[] = [
  {
    text: `Acesso permitido apenas para:\n✔ ${projectConfig.playerOneName}\n✔ ${projectConfig.playerTwoName}`,
    pause: "long",
  },
];

export const classificationAnalyzing = "Identificando objetivo do projeto...";

export const classificationResultLines: NarratorLine[] = [
  { text: "Objetivo do projeto:\nACESSO NEGADO", pause: "long" },
  { text: "Tempo estimado: ???\nPrêmio: ???", pause: "short" },
  {
    text: "Algumas informações\nnão precisam ser reveladas\nlogo no começo.",
    pause: "long",
  },
];

export const inviteLines: NarratorLine[] = [
  { text: "Bem-vindo.", pause: "long" },
  { text: "Antes de começar...", pause: "long" },
  { text: "Você aceita jogar\nsem saber qual é o prêmio?", pause: "short" },
];

export const noButtonExplodedLines: NarratorLine[] = [
  { text: "Parabéns.", pause: "short" },
  { text: "Você encontrou\num Easter Egg.", pause: "short" },
  { text: "Mas eu já sabia\nque você não ia desistir.", pause: "short" },
  { text: "Então removi\nessa opção. 🙂", pause: "long" },
];

export const acceptedResponseLines: NarratorLine[] = [
  { text: "Resposta aceita.", pause: "short" },
  { text: "Embora você não tivesse\nmuita escolha.", pause: "long" },
];

export const termsItems: string[] = [
  "Vai aproveitar o dia.",
  "Vai rir de pelo menos uma piada ruim.",
  "Não vai tentar descobrir o final.",
  "Não vai pressionar o desenvolvedor.",
  "Aceita que este projeto pode conter bugs emocionais.",
  "Concorda que Taylor Swift melhora qualquer situação.",
  `Caso encontre algum problema, abraçará ${projectConfig.playerOneName} por 20 segundos.`,
  "Aceita que algumas etapas dependerão de acontecimentos fora da tela.",
  "Entende que não é possível apressar uma boa história.",
];

export const termsFastClickLines: NarratorLine[] = [
  { text: "Leu mesmo?", pause: "short" },
  { text: "Tudo bem.\nVou fingir que acredito.", pause: "long" },
];

/** Abaixo do qual um clique em "Li absolutamente tudo" é considerado rápido demais. */
export const TERMS_FAST_CLICK_THRESHOLD_MS = 1800;

export const eraOneIntroLines: NarratorLine[] = [
  { text: "Toda história precisa de um primeiro acontecimento.", pause: "short" },
];
