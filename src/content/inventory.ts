import type { InventoryItem } from "@/types/game";

/**
 * O inventário.
 *
 * A regra é uma só: **o sistema nunca explica para que os itens servem.**
 * Ele os entrega com toda a seriedade de um jogo que tem crafting, os
 * lista num menu com contador, e nunca oferece um botão de "usar". A
 * piada depende dessa cara séria — cada `note` é um laudo técnico sobre
 * um objeto que não faz nada.
 *
 * O significado só aparece uma vez, na última tela do jogo
 * (`AfterYesSequence`), quando fica claro que a lista inteira era um
 * resumo da relação de vocês dois em ordem cronológica.
 */
export const inventoryItems: InventoryItem[] = [
  {
    id: "pulseira-taylor",
    name: "PULSEIRA DA TAYLOR",
    glyph: "bracelet",
    note: "Contas de plástico. Valor de mercado: irrelevante.",
    foundLine: "Você guardou isso.\nEu também teria guardado.",
  },
  {
    id: "controle-toy-story",
    name: "CONTROLE DO TOY STORY",
    glyph: "remote",
    note: "Não controla nada. Como a maioria dos controles.",
    foundLine: "Item anexado ao arquivo.\nNão pergunte por quê.",
  },
  {
    id: "folha-villa-lobos",
    name: "FOLHA DO VILLA-LOBOS",
    glyph: "leaf",
    note: "Uma folha. De um parque. Catalogada como prova.",
    foundLine: "Isso é literalmente\numa folha.\nE mesmo assim,\naqui está ela.",
  },
  {
    id: "fatia-de-pizza",
    name: "FATIA DE PIZZA",
    glyph: "pizza",
    note: "Estado de conservação: preocupante. Mantida no inventário assim mesmo.",
    foundLine: "Não vou perguntar\nhá quanto tempo\nisso está aí.",
  },
  {
    id: "pedra-da-augusta",
    name: "PEDRA DA RUA AUGUSTA",
    glyph: "stone",
    note: "Pedra comum. Origem confirmada por testemunho duvidoso.",
    foundLine: "Você pegou uma pedra\nda calçada.\nRegistrado.",
  },
  {
    id: "mapa-dos-banheiros",
    name: "MAPA DOS BANHEIROS DE SÃO PAULO",
    glyph: "map",
    note: "Desatualizado. Todos estão fechados.",
    foundLine: "Tarde demais,\nmas é seu.",
  },
  {
    id: "copo-de-leite",
    name: "COPO DE LEITE",
    glyph: "milk",
    note: "Temperatura: ambiente. Recomendação médica: nenhuma.",
    foundLine: "Item adicionado\ncontra o meu\nmelhor julgamento.",
  },
  {
    id: "cachecol-tricolor",
    name: "CACHECOL TRICOLOR",
    glyph: "scarf",
    note: "Vermelho, preto e branco. Nesta ordem. Não aceito discussão.",
    foundLine: "Este item\nnão é negociável.",
  },
  {
    id: "recorte-de-jornal",
    name: "RECORTE DE JORNAL",
    glyph: "clipping",
    note: "Manchete ilegível. Fonte não confiável. Guardado mesmo assim.",
    foundLine: "Alguém falou\nalguma coisa\nsobre vocês.",
    // reputation: o item é literalmente o que os outros disseram.
  },
  {
    id: "anel-de-papel",
    name: "ANEL DE PAPEL",
    glyph: "ring",
    note: "Material: papel. Durabilidade: nenhuma. Tamanho: errado.",
    foundLine: "Não serve\nem nenhum dedo.\nNem no seu.",
  },
  {
    id: "fio-invisivel",
    name: "FIO INVISÍVEL",
    glyph: "string",
    note: "Item não pode ser exibido. O item está no inventário mesmo assim.",
    foundLine: "Este eu não\nconsigo desenhar.",
  },
];

const byId = new Map(inventoryItems.map((item) => [item.id, item]));

export function getInventoryItem(id: string): InventoryItem | undefined {
  return byId.get(id);
}

/** Mensagem do menu quando ainda não há nada guardado. */
export const emptyInventoryNote =
  "Nenhum item.\nAinda não aconteceu\nnada digno de guardar.";

/**
 * O texto que o menu exibe embaixo da lista. Continua sem explicar nada
 * — a pergunta óbvia do jogador ("para que serve isso?") é justamente a
 * que o sistema se recusa a responder.
 */
export const inventoryFooterNote = "Utilidade: a ser determinada.";
