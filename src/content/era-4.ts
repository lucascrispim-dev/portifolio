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

const HABILITACAO: EraDefinition["achievements"][number] = {
  id: "habilitacao-emocional",
  title: "HABILITAÇÃO EMOCIONAL",
};

/**
 * Era IV — Red.
 *
 * A Era **instável**. A tela treme sozinha, os avisos se contradizem e
 * as falhas roteirizadas chegam sem pedir licença — é a única Era em que
 * o sistema não consegue manter a compostura por dois minutos seguidos.
 *
 * É também a primeira depois do falso reset, e o narrador finge que nada
 * aconteceu com uma insistência suspeita. Tudo se passa na Augusta:
 * perguntas sobre a rua, um banheiro que não existe e um exame de
 * habilitação emocional que reprova o candidato em todas as questões e
 * emite a carteira assim mesmo.
 */
export const era4: EraDefinition = {
  id: 4,
  code: "IV",
  title: "Red",
  album: "Red",
  theme: eraThemes[4],
  achievements: [CONFIDENTIAL, MIJAO, HABILITACAO],
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
      // O sistema insiste que está tudo bem e imediatamente exibe sete
      // registros ilegíveis. Ninguém aqui está convencendo ninguém.
      kind: "interrupt",
      id: "era4-corrompidos",
      error: "dados-corrompidos",
      lines: [
        { text: "E, para constar,", pause: "short" },
        { text: "isso não tem nenhuma\nrelação com o que\nnão aconteceu antes.", pause: "long" },
      ],
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
    { kind: "item", id: "era4-pedra", itemId: "pedra-da-augusta" },
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
    { kind: "item", id: "era4-mapa-banheiros", itemId: "mapa-dos-banheiros" },
    { kind: "file", id: "era4-arquivo", fileId: "arquivo-011" },
    // O exame de habilitação emocional — a Era do término encontra a
    // Olivia Rodrigo pelo único caminho possível: a carteira de motorista.
    { kind: "minigame", id: "era4-exame", game: "drivingTest" },
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
