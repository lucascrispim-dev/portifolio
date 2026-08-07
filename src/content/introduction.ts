import { projectConfig } from "@/config/project";
import type { Achievement, NarratorLine } from "@/types/game";

export const bootLines: NarratorLine[] = [
  { text: "Inicializando...", pause: "short" },
  { text: "Conexão estabelecida.", pause: "short" },
  { text: "Projeto localizado.", pause: "long" },
];

export const bootTitle = projectConfig.projectName;

export const classificationHeader = "CLASSIFICAÇÃO\nCONFIDENCIAL";

export const classificationBlock: string[] = [
  "Acesso permitido apenas para:",
  projectConfig.playerOneName,
  projectConfig.playerTwoJokeName,
];

export const classificationAnalyzing = "Identificando objetivo do projeto...";

export const classificationResultBlock: string[] = [
  "Objetivo do projeto:",
  "ACESSO NEGADO",
  "",
  "Tempo estimado:",
  "INDEFINIDO",
  "",
  "Prêmio:",
  "CLASSIFICADO",
];

export const inviteLines: NarratorLine[] = [
  { text: "Bem-vindo.", pause: "long" },
  { text: "Antes de começar...", pause: "long" },
  { text: "Você aceita jogar\nsem saber qual é o prêmio?", pause: "short" },
];

export const noButtonExplodedLines: NarratorLine[] = [
  { text: "Parabéns.", pause: "short" },
  { text: "Você encontrou\no primeiro Easter Egg.", pause: "short" },
  { text: "Mas eu sabia\nque você não desistiria.", pause: "short" },
  { text: "Então removi\nessa opção.", pause: "short" },
  { text: "Agora escolha\nentre Sim e Sim.", pause: "long" },
];

/** Entregue por perseguir um botão que nunca teve intenção de parar. */
export const noButtonAchievement: Achievement = {
  id: "persistencia-questionavel",
  title: "PERSISTÊNCIA QUESTIONÁVEL",
};

/** Primeira vez que o sistema aplica o nome "corrigido". */
export const welcomeLines: NarratorLine[] = [
  { text: "Decisão registrada.", pause: "short" },
  { text: `Bem-vindo,\n${projectConfig.playerTwoJokeName}.`, pause: "long" },
];

export const termsItems: string[] = [
  "Vai ler antes de apertar os botões.",
  "Não tentará descobrir o final.",
  "Não pressionará o desenvolvedor.",
  "Aceita que Taylor Swift melhora qualquer situação.",
  "Aceita a presença de bugs emocionais.",
  "Não tentará acessar a Era XIII antes da hora.",
  `Aceita ser chamado de ${projectConfig.playerTwoJokeName}.`,
  "Aceita que o desenvolvedor é dramático.",
  "Concorda que qualquer reclamação poderá resultar em mais perguntas.",
  "Entende que o desenvolvedor não se responsabiliza por surtos, confetes ou sentimentos.",
];

export const termsFastClickLines: NarratorLine[] = [
  { text: "Leu?", pause: "short" },
  {
    text: `${projectConfig.playerTwoJokeName},\nnem deu tempo.`,
    pause: "short",
  },
  { text: "Tudo bem.\nVou fingir que acredito.", pause: "long" },
];

/** Abaixo disso, o clique em "Li absolutamente tudo" conta como rápido demais. */
export const TERMS_FAST_CLICK_THRESHOLD_MS = 2500;

/** Primeira aparição do mapa, logo depois dos termos. */
export const progressMapIntroLines: NarratorLine[] = [
  { text: "Antes de começar,\nveja o que existe pela frente.", pause: "long" },
];
