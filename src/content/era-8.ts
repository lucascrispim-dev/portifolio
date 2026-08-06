import { eraThemes } from "@/config/themes";
import type { EraDefinition } from "@/types/game";

/**
 * Era terminal e irreversível — sem completionEvent, sem
 * eventConfirmation. A última tela (finalTransfer) não tem "cta": depois
 * de "Olha para ele." não existe nenhuma interação (ver docs/roteiro/
 * ERA VIII • folklore.md).
 */
export const era8: EraDefinition = {
  id: 8,
  code: "VIII",
  title: "folklore",
  album: "folklore",
  theme: eraThemes[8],
  badges: [],
  screens: [
    {
      kind: "lines",
      id: "era8-abertura",
      lines: [
        { text: "...", pause: "long" },
        { text: "Não consegui.", pause: "long" },
      ],
      cta: "Continuar",
    },
    {
      kind: "titleCard",
      id: "era8-title",
      eraLabel: "ERA VIII",
      title: "folklore",
      tagline: "Algumas histórias precisam terminar fora das páginas.",
      cta: "Continuar.",
    },
    {
      kind: "lines",
      id: "era8-recap",
      lines: [
        { text: "Passei o dia inteiro\ntentando entender vocês.", pause: "long" },
        { text: "Organizei as lembranças.", pause: "short" },
        { text: "Guardei os momentos.", pause: "short" },
        { text: "Registrei as conversas.", pause: "short" },
        { text: "Descobri o motivo\nde tantas risadas.", pause: "long" },
        { text: "Entendi por que Toy Story\nera importante.", pause: "long" },
        { text: "Entendi por que\numa simples pizza\nvirou uma lembrança.", pause: "long" },
        {
          text: "Entendi por que\nTaylor Swift aparece\nem praticamente tudo. 😂",
          pause: "long",
        },
        {
          text: "Até consegui descobrir\npor que o Villa-Lobos\nmudou completamente\nesta história.",
          pause: "long",
        },
      ],
      cta: "Continuar",
    },
    {
      kind: "compatibility",
      id: "era8-compatibility",
      flickerBeforeSettle: true,
      lines: [
        { text: "Resultado:\n99%", pause: "long" },
        { text: "Agora eu entendi.", pause: "long" },
        { text: "Nunca existiu\num erro.", pause: "short" },
        { text: "Nunca faltou\numa lembrança.", pause: "short" },
        { text: "Nunca faltou\numa resposta minha.", pause: "long" },
        { text: "O último 1%\nnunca pertenceu a mim.", pause: "long" },
      ],
    },
    {
      kind: "lines",
      id: "era8-pergunta",
      lines: [
        { text: "Existe uma única pergunta\nque eu nunca poderei fazer.", pause: "long" },
        {
          text: "Porque algumas perguntas\nnão devem aparecer\nem uma tela.",
          pause: "long",
        },
        { text: "Elas precisam ser feitas\nolhando nos olhos.", pause: "long" },
      ],
      cta: "Continuar",
    },
    {
      kind: "lines",
      id: "era8-despedida",
      lines: [
        { text: "Acho que...\ncheguei até onde consigo.", pause: "long" },
        { text: "Foi divertido\nacompanhar vocês.", pause: "short" },
        { text: "Obrigado\npor confiarem em mim.", pause: "long" },
        { text: "Mas a partir daqui...\neu só atrapalharia.", pause: "long" },
      ],
      cta: "Continuar",
    },
    { kind: "finalTransfer", id: "era8-final" },
  ],
};
