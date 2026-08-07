import { projectConfig } from "@/config/project";
import { eraThemes } from "@/config/themes";
import type { EraDefinition } from "@/types/game";

/**
 * Era VI — a única batida verdadeiramente emocional antes do final. O
 * jogo levanta a pergunta ("o que vocês são?"), pede a resposta dele e
 * então recusa mostrar a do Lucas: ACESSO NEGADO. É a isca que faz a
 * Era XIII parecer o lugar onde tudo se resolve.
 */
export const era6: EraDefinition = {
  id: 6,
  code: "VI",
  title: "reputation",
  album: "reputation",
  theme: eraThemes[6],
  achievements: [],
  screens: [
    {
      kind: "titleCard",
      id: "era6-title",
      eraLabel: "ERA VI",
      title: "reputation",
      tagline: [
        {
          text: "Existem histórias\nque parecem simples\npara quem observa de fora.",
          pause: "short",
        },
        { text: "Esta não é uma delas.", pause: "long" },
      ],
      cta: "CONTINUAR",
    },
    {
      kind: "reveal",
      id: "era6-villa-lobos",
      systemBlock: ["ARQUIVO LOCALIZADO", "VILLA-LOBOS", "", "Evento: Primeiro beijo."],
      lines: [
        { text: "Algumas memórias\nnão precisam de explicação.", pause: "long" },
        { text: "Elas explicam\ntodo o resto.", pause: "long" },
      ],
      cta: "CONTINUAR",
    },
    { kind: "minigame", id: "era6-call-it", game: "callItWhatYouWant" },
    {
      kind: "openQuestion",
      id: "era6-sentimento",
      questionId: "o-que-sente",
      label: "PERGUNTA ABERTA",
      prompt: [
        { text: "Sem alternativas.", pause: "short" },
        { text: "Sem piada.", pause: "short" },
        { text: "O que você sente\nquando está com ele?", pause: "long" },
      ],
      echo: true,
      submitLabel: "ENVIAR",
      response: [
        { text: "Recebido.", pause: "long" },
        { text: "Guardado.", pause: "long" },
      ],
    },
    {
      kind: "reveal",
      id: "era6-resposta-lucas",
      systemBlock: [
        "RESPOSTA CORRESPONDENTE",
        `Origem: ${projectConfig.playerOneName}`,
        "Status: ARQUIVADA",
      ],
      lines: [
        { text: "Ele respondeu\na mesma pergunta.", pause: "long" },
        { text: "Quer ver?", pause: "long" },
      ],
      cta: "VER RESPOSTA DE LUCAS",
    },
    {
      kind: "reveal",
      id: "era6-acesso-negado",
      systemBlock: ["ACESSO NEGADO", "", "Disponível em:", "ERA XIII"],
      lines: [
        { text: "Ainda não.", pause: "short" },
        { text: "Eu avisei que existia\numa parte classificada.", pause: "long" },
      ],
      cta: "CONTINUAR",
    },
    {
      kind: "compatibility",
      id: "era6-compatibilidade",
      label: "RECALCULANDO",
      lines: [
        { text: "Nem essa resposta\nresolveu aquele 1%.", pause: "short" },
        {
          text: "A Era XIII\nestá se tornando\nestatisticamente suspeita.",
          pause: "long",
        },
      ],
    },
    {
      kind: "eraOutro",
      id: "era6-outro",
      progressLabel: "77%",
      lines: [
        {
          text: "Eu chamaria\nde uma situação\ncada vez mais suspeita.",
          pause: "long",
        },
      ],
      cta: "PRÓXIMA ERA",
    },
  ],
};
