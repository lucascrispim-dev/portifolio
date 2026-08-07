# PROJECT: NEXT ERA

Uma experiência web narrativa, mobile-first, jogada de uma sentada (45 a 70 minutos). O jogo aparenta ter **13 Eras**, mas só as oito primeiras existem: depois de concluir a folklore, um "evento não programado" interrompe o sistema, as Eras IX a XIII são canceladas e o controle passa para o Lucas. **O pedido não acontece no site.**

> **Fonte de verdade:** [`docs/roteiro/NOVO-FLUXO-13-ERAS.md`](docs/roteiro/NOVO-FLUXO-13-ERAS.md). Os oito arquivos de Era ao lado dele documentam o roteiro anterior (progressão por acontecimentos reais ao longo de um dia) e ficam preservados como histórico — o código em `src/content/*.ts` deriva do fluxo novo.

## Stack

Next.js (App Router) · React 19 · TypeScript estrito · Tailwind CSS v4 · Framer Motion · `localStorage` · Vitest

Sem backend, sem banco de dados. Não há cronômetro, senha, localização, painel administrativo nem confirmação de acontecimentos externos: cada Era abre a próxima assim que o jogador termina as interações.

## O truque

Até o jogador tocar em **ENCERRAR**, tudo na tela sustenta que a história continua depois:

- o mapa lista 13 Eras com nomes reais de álbuns (evermore, Midnights, The Tortured Poets Department, The Life of a Showgirl), então a lista parece um plano completo;
- a compatibilidade sobe em múltiplos de 13 e **sempre trava em 99%**, com o 1% restante atribuído à Era XIII;
- a Era VIII se apresenta como arquivo de análise e termina com "Status: AINDA NÃO ESCRITO".

Se alguma dessas peças for enfraquecida, a surpresa deixa de funcionar. `tests/era-catalog.test.ts` protege as mais frágeis.

## Instalação

```bash
npm install
```

## Execução

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000). O layout é mobile-first — use as ferramentas de dispositivo do navegador (ex.: iPhone 390×844) para testar como no celular.

## Build de produção

```bash
npm run build
npm run start
```

## Deploy na Vercel

O projeto é um app Next.js padrão na raiz do repositório — a Vercel detecta tudo sozinha. **Não existe `vercel.json` de propósito:** qualquer configuração manual aqui só teria como efeito atrapalhar a detecção automática.

1. Em [vercel.com/new](https://vercel.com/new), importe o repositório `lucascrispim-dev/portifolio`.
2. Em **Branch**, escolha a branch onde este app está (`claude/next-era-web-game-gfnj6o`) — ou faça o merge dela na branch padrão antes e deixe a Vercel usar a padrão.
3. Não mexa em Framework Preset, Build Command, Output Directory nem Install Command. Os valores detectados (Next.js / `next build`) já estão certos.
4. **Environment Variables: não adicione nenhuma.** Em especial, *não* defina `NEXT_PUBLIC_ENABLE_DEV_TOOLS` — ela liga o painel de desenvolvimento (pular Eras, limpar progresso), que não pode existir na versão que o jogador usa. O valor ausente já significa "desligado".
5. Deploy. A Vercel devolve uma URL `https://<projeto>.vercel.app` — abra essa URL no celular.

Checagens rápidas depois de publicar, direto no celular:

- O progresso sobrevive a fechar e reabrir a aba (fica no `localStorage` do aparelho — cada celular tem o seu).
- Nenhum botão "DEV" aparece em canto nenhum da tela.
- O botão "Não" foge e não escapa da área visível.

> Cuidado: o progresso é gravado por navegador. Se o jogador começar no Chrome e depois abrir no Safari, ele recomeça do zero — combine de usar sempre o mesmo navegador, e evite janela anônima.

## Testes e validação

```bash
npm run lint        # ESLint
npm run typecheck   # tsc --noEmit
npm run test         # Vitest — testa a máquina de estados e a lógica do botão "Não"
npm run test:watch  # Vitest em modo watch
```

Antes de considerar qualquer alteração concluída, rode os quatro comandos acima **e** `npm run build`.

## Personalização

Toda configuração editável fica centralizada em [`src/config/project.ts`](src/config/project.ts):

```ts
export const projectConfig = {
  projectName: "PROJECT: NEXT ERA",
  playerOneName: "Lucas",
  playerTwoName: "Cacau Nazaret", // troque aqui — não precisa procurar em outros arquivos
  symbolicDate: "08/08",
  noButtonAttempts: 8,
  storageKey: "project-next-era-progress",
  totalEras: 13,          // quantas Eras o jogo aparenta ter
  longLiveThreshold: 7,   // achievements para destravar o "Long Live"
};
```

O mesmo arquivo tem `bonusNarratorLines`, um espaço central para novas piadas internas ou mensagens espontâneas extras do narrador, sem tocar em nenhum componente.

As cores/tipografia/textura de cada Era estão em [`src/config/themes.ts`](src/config/themes.ts).

## Modo de desenvolvimento

Desligado por padrão. Para ativar localmente (nunca em produção):

```bash
# .env.local
NEXT_PUBLIC_ENABLE_DEV_TOOLS=true
```

Com a flag ativa, um botão **DEV** aparece no canto inferior direito, permitindo pular para qualquer Era, limpar o progresso e forçar cada etapa da sequência final (`interrupted`, `transferring`, `final`) — sem senha visível dentro do jogo. Confirme que `NEXT_PUBLIC_ENABLE_DEV_TOOLS` **não** está definida (ou está `false`) antes de publicar.

## Arquitetura

```
docs/roteiro/
  NOVO-FLUXO-13-ERAS.md  Fonte de verdade atual
  ERA * .md              Roteiro anterior, preservado como histórico
src/
  app/                   page.tsx, layout.tsx (fontes + comentário escondido), globals.css
  components/game/       Telas e componentes; minigames/ tem os minijogos
  content/               Conteúdo tipado das 8 Eras + catálogo das 13
  config/                projectConfig + temas por Era
  hooks/                 useGameProgress (estado + persistência), useReducedMotion
  lib/                   storage.ts, game-machine.ts (reducer puro), no-button.ts, audio.ts
  types/                 Tipos centrais (GameProgress, EraDefinition, EraScreen, ...)
tests/                   Máquina de estados, catálogo das Eras e botão "Não"
```

A máquina de estados (`src/lib/game-machine.ts`) é um reducer puro e testável. Cada Era avança por cenas (`ERA_SCENE_ADVANCE`) e, ao terminar a última, `ERA_COMPLETE` libera a seguinte imediatamente. Só as Eras 1 a 8 têm conteúdo; as 9 a 13 vivem apenas em `src/content/era-catalog.ts` e nunca saem de `locked`.

A sequência final é guardada em `finalStage` (`playing` → `interrupted` → `transferring` → `final`) e **persistida**: recarregar a página depois do ENCERRAR não devolve o jogador ao jogo nem repete a surpresa.

## Som

Desligado por padrão e opcional em tudo. Os efeitos são sintetizados na hora com a Web Audio API (`src/lib/audio.ts`) — nenhum arquivo, nenhuma requisição de rede e nada protegido por direitos autorais. O controle fica no canto superior direito (`SoundToggle`), com `aria-label`, e some por completo na sequência final da Era VIII, onde não pode existir nenhuma opção na tela.

## Prototipagem visual

O sistema de temas e as telas-chave foram prototipados antes da implementação em um arquivo Figma (design system das 8 Eras + telas representativas: boot, convite, botão "Não", Termos de Uso, Era I completa, indicador de compatibilidade, sequência final da Era VIII), usado como referência visual durante o desenvolvimento.

## Sobre o texto e o roteiro

Falas do narrador, perguntas, respostas, badges, missões e easter eggs em `src/content/*.ts` são reproduzidos verbatim de `docs/roteiro/`. Apenas o "chrome" estrutural de retorno ao app (ex.: "Você voltou... já aconteceu?") foi adaptado por Era a partir do padrão estabelecido pela Era I, conforme instruído no roteiro — nenhum texto narrativo principal foi inventado.
