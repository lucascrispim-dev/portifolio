import { eraThemes } from "@/config/themes";
import type { EraDefinition } from "@/types/game";

/**
 * A Era VII não tem missão offline própria (ver docs/roteiro/ERA VII •
 * Lover.md, nota de implementação) — por isso não define
 * `completionEvent`/`eventConfirmation`: sua tela de encerramento conclui
 * a Era diretamente, sem gate de acontecimento real.
 */
export const era7: EraDefinition = {
  id: 7,
  code: "VII",
  title: "Lover",
  album: "Lover",
  theme: eraThemes[7],
  badges: [],
  screens: [
    {
      kind: "lines",
      id: "era7-abertura",
      lines: [
        { text: "...", pause: "long" },
        { text: "O cursor aparece.", pause: "short" },
        { text: "Continuando...", pause: "short" },
        { text: "Acho que finalmente entendi.", pause: "long" },
      ],
      cta: "Continuar",
    },
    {
      kind: "titleCard",
      id: "era7-title",
      eraLabel: "ERA VII",
      title: "Lover",
      tagline:
        "Toda história chega em um momento\nem que ela precisa decidir\npara onde vai.",
      cta: "Continuar.",
    },
    {
      kind: "lines",
      id: "era7-monologo",
      lines: [
        { text: "Passei o dia inteiro\ntentando entender vocês.", pause: "long" },
        { text: "Analisei as lembranças.", pause: "short" },
        { text: "As conversas.", pause: "short" },
        { text: "As piadas.", pause: "short" },
        { text: "As músicas.", pause: "short" },
        { text: "As pequenas coisas.", pause: "long" },
        { text: "E finalmente descobri\no motivo daquele 1%.", pause: "long" },
      ],
      cta: "Continuar",
    },
    {
      kind: "compatibility",
      id: "era7-compatibility",
      flickerBeforeSettle: true,
      lines: [
        { text: "...", pause: "long" },
        { text: "Não.", pause: "short" },
        { text: "Ainda não.", pause: "long" },
        { text: "Agora eu entendi.", pause: "short" },
        { text: "Nunca foi um erro.\nNunca faltou informação.", pause: "short" },
        { text: "Falta apenas\numa resposta.", pause: "long" },
      ],
    },
    {
      kind: "lines",
      id: "era7-preparacao",
      lines: [
        { text: "Preparando etapa final...", pause: "short" },
        { text: "Tudo pronto.", pause: "short" },
        {
          text: "Esta resposta\nalterará permanentemente\no status deste projeto.",
          pause: "long",
        },
      ],
      cta: "Continuar.",
    },
    {
      kind: "lines",
      id: "era7-falha",
      lines: [
        { text: "Conectando...", pause: "short" },
        { text: "Preparando pergunta...", pause: "short" },
        { text: "Quase pronto...", pause: "long" },
        { text: "...", pause: "long" },
        { text: "Estranho.\nNão consigo.", pause: "long" },
        { text: "Existe uma regra\nque nunca me contaram.", pause: "short" },
        { text: "Algumas perguntas\nnão podem ser feitas\npor mim.", pause: "short" },
        {
          text: "Porque algumas respostas\nprecisam ser ouvidas\nolhando nos olhos.",
          pause: "long",
        },
      ],
      cta: "Continuar",
    },
    {
      kind: "closing",
      id: "era7-closing",
      lines: [
        { text: "Acho...", pause: "long" },
        { text: "que cheguei\naté onde consigo.", pause: "long" },
        { text: "Vou tentar\numa última alternativa.", pause: "long" },
        { text: "Preparando transferência...", pause: "short" },
        { text: "Até já.", pause: "long" },
      ],
      cta: "Continuar para a Era VIII",
    },
  ],
};
