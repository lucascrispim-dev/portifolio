import { eraThemes } from "@/config/themes";
import type { EraDefinition } from "@/types/game";

const PIZZA: EraDefinition["achievements"][number] = {
  id: "pizza-professional",
  title: "PIZZA PROFESSIONAL",
};

const CONFIDENTIAL: EraDefinition["achievements"][number] = {
  id: "confidential-information",
  title: "CONFIDENTIAL INFORMATION",
};

export const era4: EraDefinition = {
  id: 4,
  code: "IV",
  title: "Red",
  album: "Red",
  theme: eraThemes[4],
  achievements: [PIZZA, CONFIDENTIAL, { id: "the-lucky-one", title: "THE LUCKY ONE" }],
  screens: [
    {
      kind: "titleCard",
      id: "era4-title",
      eraLabel: "ERA IV",
      title: "Red",
      tagline: [
        {
          text: "Algumas histórias\nmudam por causa\nde grandes acontecimentos.",
          pause: "short",
        },
        { text: "Outras mudam\npor causa de pizza.", pause: "long" },
      ],
      cta: "CONTINUAR",
    },
    {
      kind: "quiz",
      id: "era4-pizza",
      prompt: [{ text: "Um dia\nquase sempre fica melhor com:" }],
      options: [
        { id: "pizza", label: "Pizza.", correct: true },
        { id: "sushi", label: "Sushi." },
        { id: "hamburguer", label: "Hambúrguer." },
        { id: "discussao", label: "Uma discussão desnecessária." },
      ],
      onWrong: [{ text: "Não.\nPensa melhor." }],
      onCorrect: [{ text: "Hipótese confirmada.", pause: "long" }],
      achievement: PIZZA,
    },
    {
      kind: "quiz",
      id: "era4-linha",
      prompt: [{ text: "Quem costuma perder\na linha primeiro?" }],
      options: [
        { id: "lucas", label: "Lucas." },
        { id: "eu", label: "Eu." },
        { id: "depende", label: "Depende do assunto." },
        { id: "lgpd", label: "Informação protegida pela LGPD." },
      ],
      anyAnswerAccepted: true,
      onCorrect: [
        { text: "Consultando arquivos...", pause: "short" },
        { text: "Informação localizada.", pause: "long" },
        { text: "Melhor não registrar.", pause: "long" },
      ],
      achievement: CONFIDENTIAL,
    },
    {
      kind: "compatibility",
      id: "era4-compatibilidade",
      lines: [
        { text: "Existe 1%\nque não consigo calcular.", pause: "short" },
        {
          text: "Talvez a informação restante\nesteja armazenada\nna Era XIII.",
          pause: "long",
        },
      ],
    },
    {
      kind: "eraOutro",
      id: "era4-outro",
      progressLabel: "4 de 13",
      lines: [{ text: "Tudo mudou.", pause: "long" }],
      cta: "PRÓXIMA ERA",
    },
  ],
};
