import { eraThemes } from "@/config/themes";
import type { EraDefinition } from "@/types/game";

const CONFIDENTIAL: EraDefinition["achievements"][number] = {
  id: "confidential-information",
  title: "CONFIDENTIAL INFORMATION",
};

const MIJAO: EraDefinition["achievements"][number] = {
  id: "mijao",
  title: "MIJÃO",
};

/**
 * Era IV — a primeira depois do falso reset. O narrador finge que nada
 * aconteceu, e a Era inteira se passa na Augusta: perguntas sobre a rua
 * e um banheiro que não existe.
 */
export const era4: EraDefinition = {
  id: 4,
  code: "IV",
  title: "Red",
  album: "Red",
  theme: eraThemes[4],
  achievements: [CONFIDENTIAL, MIJAO],
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
        { text: "Outras mudam\nna Augusta,\nàs três da manhã.", pause: "long" },
      ],
      cta: "CONTINUAR",
    },
    {
      kind: "lines",
      id: "era4-nada-aconteceu",
      lines: [
        { text: "Antes de continuar.", pause: "short" },
        { text: "Não aconteceu nada.", pause: "short" },
        { text: "Você imaginou.", pause: "long" },
      ],
      cta: "CONTINUAR",
    },
    {
      kind: "quiz",
      id: "era4-augusta",
      prompt: [{ text: "Qual rua tem\na maior densidade\nde histórias de vocês\npor metro quadrado?" }],
      options: [
        { id: "augusta", label: "Augusta.", correct: true },
        { id: "paulista", label: "Paulista." },
        { id: "consolacao", label: "Consolação." },
        { id: "nenhuma", label: "Prefiro não responder." },
      ],
      onWrong: [
        { text: "Não.", pause: "short" },
        { text: "E você sabe que não.", pause: "short" },
      ],
      onCorrect: [
        { text: "Augusta confirmada.", pause: "short" },
        { text: "Registros parciais.", pause: "short" },
        { text: "Por decisão do sistema.", pause: "long" },
      ],
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
    { kind: "minigame", id: "era4-banheiro", game: "bathroomMaze" },
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
      theOneEasterEgg: true,
    },
    {
      kind: "eraOutro",
      id: "era4-outro",
      progressLabel: "PROGRESSO: INDETERMINADO",
      recalculatedLabel: "52%",
      recalculatedLines: [
        { text: "Pronto.", pause: "short" },
        { text: "Inventei um número.", pause: "short" },
        { text: "Ninguém vai conferir.", pause: "long" },
      ],
      lines: [{ text: "Tudo mudou.", pause: "long" }],
      cta: "PRÓXIMA ERA",
    },
  ],
};
