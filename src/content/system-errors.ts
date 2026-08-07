import { projectConfig } from "@/config/project";
import type { SystemErrorId, SystemErrorSpec } from "@/types/game";

/**
 * Os defeitos do sistema.
 *
 * Nenhum deles é aleatório: cada um está posicionado numa Era específica,
 * dura o tempo de assustar e se resolve sozinho com uma desculpa pior que
 * o problema. O ERRO 13 não está aqui — aquele é grande demais para ser
 * um susto e tem sequência própria (`Erro13Sequence`).
 *
 * A regra que faz isso funcionar: o sistema **sempre** se recupera, e
 * **sempre** encontra alguém para culpar.
 */
export const systemErrors: Record<SystemErrorId, SystemErrorSpec> = {
  "erro-08": {
    id: "erro-08",
    code: "ERRO 08",
    detail: [
      "Falha ao processar resposta.",
      "Motivo: resposta boa demais.",
      "",
      "Módulo afetado: sinceridade.",
    ],
    resolution: "CONTORNADO",
    after: [
      { text: "Isso não deveria\nter acontecido.", pause: "short" },
      { text: "Vou fingir que\nnão aconteceu.", pause: "long" },
    ],
  },
  "erro-22": {
    id: "erro-22",
    code: "ERRO 22",
    detail: [
      "Conflito de versão detectado.",
      "",
      "Esperado: uma pessoa razoável.",
      "Encontrado: " + projectConfig.playerTwoJokeName + ".",
    ],
    resolution: "IGNORADO",
    after: [
      { text: "O sistema optou\npor seguir mesmo assim.", pause: "short" },
      { text: "Contra recomendação\ntécnica.", pause: "long" },
    ],
  },
  "dados-corrompidos": {
    id: "dados-corrompidos",
    code: "DADOS CORROMPIDOS",
    detail: [
      "Sete registros ilegíveis.",
      "Três registros duplicados.",
      "Um registro chorando.",
      "",
      "Tentando reparar...",
    ],
    resolution: "PARCIALMENTE REPARADO",
    after: [
      { text: "Recuperei quase tudo.", pause: "short" },
      { text: "O que faltou\nprovavelmente\nnão era importante.", pause: "short" },
      { text: "Provavelmente.", pause: "long" },
    ],
  },
  reconectando: {
    id: "reconectando",
    code: "RECONECTANDO",
    detail: [
      "Conexão perdida.",
      "Tentativa 1 de 13...",
      "Tentativa 2 de 13...",
      "",
      "Verificando se alguém",
      "ainda está aí.",
    ],
    resolution: "CONEXÃO RESTABELECIDA",
    after: [
      { text: "Você continua aí.", pause: "short" },
      { text: "Anotado.", pause: "long" },
    ],
  },
  "versao-incompativel": {
    id: "versao-incompativel",
    code: "VERSÃO INCOMPATÍVEL",
    detail: [
      "Este projeto foi compilado",
      "para uma pessoa específica.",
      "",
      "Verificando identidade...",
      "Identidade: aceitável.",
    ],
    resolution: "EXECUÇÃO AUTORIZADA",
    after: [
      { text: "Você passou\nna verificação.", pause: "short" },
      { text: "Era a única\nque existia.", pause: "long" },
    ],
  },
  "tentando-restaurar": {
    id: "tentando-restaurar",
    code: "TENTANDO RESTAURAR",
    detail: [
      "Backup localizado.",
      "Data do backup: hoje.",
      "Conteúdo do backup: este jogo.",
      "",
      "Restaurando o jogo",
      "a partir do jogo...",
    ],
    resolution: "RESTAURADO",
    after: [
      { text: "Funcionou.", pause: "short" },
      { text: "Não me pergunte\ncomo.", pause: "long" },
    ],
  },
};

export function getSystemError(id: SystemErrorId): SystemErrorSpec {
  return systemErrors[id];
}
