import { projectConfig } from "@/config/project";
import type { SecretFile } from "@/types/game";

/**
 * Arquivos secretos.
 *
 * A numeração pula de propósito (001, 004, 007, 013, 022...): o jogador
 * precisa perceber que existem arquivos que ele não encontrou. Nenhum
 * deles contém informação útil — são laudos, transcrições e anotações
 * internas de um sistema que claramente tem opinião sobre o que observa.
 *
 * Um deles não abre nunca (`ARQUIVO 013`). É a única promessa que o jogo
 * faz e não cumpre dentro das oito Eras.
 */
export const secretFiles: SecretFile[] = [
  {
    id: "arquivo-001",
    code: "ARQUIVO 001",
    name: "SUJEITO.txt",
    body: [
      "SUJEITO: " + projectConfig.playerTwoJokeName,
      "",
      "Tempo médio de leitura",
      "de termos de uso: 0s.",
      "",
      "Nível de paciência: em análise.",
      "Nível de teimosia: alto.",
      "",
      "Observação do sistema:",
      "gosto dele.",
    ],
    comment: [
      { text: "Esse arquivo\nnão era para\nestar acessível.", pause: "short" },
      { text: "Continua não sendo.", pause: "long" },
    ],
  },
  {
    id: "arquivo-004",
    code: "ARQUIVO 004",
    name: "TOY_STORY.log",
    body: [
      "REGISTRO DE REINCIDÊNCIA",
      "",
      "Menções ao filme: 14",
      "Menções necessárias: 1",
      "",
      "Conclusão: nenhuma.",
      "",
      "O sistema desistiu",
      "de contar em 2024.",
    ],
    comment: [{ text: "Catorze.", pause: "short" }, { text: "Catorze.", pause: "long" }],
  },
  {
    id: "arquivo-007",
    code: "ARQUIVO 007",
    name: "LEITE.log",
    body: [
      "ALERTA NUTRICIONAL",
      "",
      "Sujeito: " + projectConfig.playerOneName,
      "Sintoma relatado: mal-estar.",
      "Tratamento adotado: leite.",
      "Eficácia comprovada: 0%.",
      "Reincidência: 100%.",
      "",
      "Este arquivo foi enviado",
      "a um profissional de saúde.",
      "Ele não respondeu.",
    ],
    comment: [
      { text: "Eu tentei avisar\nalguém.", pause: "short" },
      { text: "Ninguém quis saber.", pause: "long" },
    ],
  },
  {
    id: "arquivo-011",
    code: "ARQUIVO 011",
    name: "AUGUSTA_03H.txt",
    body: [
      "REGISTRO PARCIAL",
      "",
      "Local: Rua Augusta.",
      "Horário: 03h e alguma coisa.",
      "",
      "Testemunhas: duas.",
      "Versões: três.",
      "",
      "O restante deste arquivo",
      "foi removido por decisão",
      "editorial do sistema.",
    ],
    comment: [
      { text: "Alguns arquivos\nprotegem vocês.", pause: "short" },
      { text: "Este protege a mim.", pause: "long" },
    ],
  },
  {
    id: "arquivo-013",
    code: "ARQUIVO 013",
    name: "———",
    body: [
      "ACESSO NEGADO",
      "",
      "Este arquivo não pode",
      "ser aberto por este usuário.",
      "",
      "Nem por mim.",
    ],
    comment: [
      { text: "Não.", pause: "short" },
      { text: "Nem tente.", pause: "long" },
    ],
  },
  {
    id: "arquivo-022",
    code: "ARQUIVO 022",
    name: "RECLAMACOES.txt",
    body: [
      "CANAL DE OUVIDORIA",
      "",
      "Reclamações recebidas: 27",
      "Reclamações analisadas: 27",
      "Reclamações procedentes: 27",
      "Reclamações atendidas: 0",
      "",
      "Obrigado pelo seu contato.",
    ],
    comment: [
      { text: "Seu retorno\né muito importante\npara nós.", pause: "long" },
    ],
  },
  {
    id: "arquivo-031",
    code: "ARQUIVO 031",
    name: "ESTATISTICAS.csv",
    body: [
      "DADOS AGREGADOS",
      "",
      "Discussões iniciadas: 0",
      "Discussões vencidas: 0",
      "Discussões vencidas por",
      projectConfig.playerOneName + ": 0",
      "",
      "Nota: os dois números acima",
      "foram auditados e estão",
      "corretos.",
    ],
    comment: [
      { text: "Ele vai contestar\nesse arquivo.", pause: "short" },
      { text: "Já contestou.", pause: "long" },
    ],
  },
];

const byId = new Map(secretFiles.map((file) => [file.id, file]));

export function getSecretFile(id: string): SecretFile | undefined {
  return byId.get(id);
}

/**
 * O arquivo que nunca é entregue por nenhuma tela. Ele aparece na lista
 * do menu como uma linha bloqueada desde o começo — a prova visível de
 * que a coleção está incompleta de propósito.
 */
export const permanentlyLockedFileId = "arquivo-013";

export const emptyFilesNote =
  "Nenhum arquivo localizado.\nIsso não significa\nque não existam.";

/** Rodapé do painel: a contagem oficial nunca bate com a lista. */
export function filesFooterNote(found: number): string {
  return `${found} de ${secretFiles.length} localizados. Os demais não existem.`;
}
