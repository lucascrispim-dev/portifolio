# PROJECT: NEXT ERA

Uma experiência web narrativa, mobile-first, jogada de uma sentada (30 a 40 minutos). O jogo aparenta ter **13 Eras**, mas só as oito primeiras existem — e o sistema que as apresenta passa a noite inteira sabotando o próprio jogador: mente sobre o progresso, mede a paciência dele, recusa o nome dele e, depois da Era III, finge corromper os dados e reiniciar do zero. Depois da folklore o narrador se dissolve, o texto vira primeira pessoa e o controle passa para o Lucas. **O pedido não acontece no site.**

> **Fonte de verdade:** [`docs/roteiro/DIRECAO-DEFINITIVA.md`](docs/roteiro/DIRECAO-DEFINITIVA.md). Os arquivos `ERA * .md` e `NOVO-FLUXO-13-ERAS.md` ao lado dele documentam roteiros anteriores e ficam preservados como histórico — o código em `src/content/*.ts` deriva da direção definitiva.

## Stack

Next.js (App Router) · React 19 · TypeScript estrito · Tailwind CSS v4 · Framer Motion · `localStorage` · Vitest

Sem backend, sem banco de dados. Não há cronômetro, senha, localização, painel administrativo nem confirmação de acontecimentos externos: cada Era abre a próxima assim que o jogador termina as interações.

## O truque

Até o jogador tocar em **ENCERRAR**, tudo na tela sustenta que a história continua depois:

- o mapa lista 13 Eras, com as Eras IX a XII já nomeadas com os álbuns seguintes (evermore, Midnights, The Tortured Poets Department, The Life of a Showgirl) e a XIII em **CLASSIFICADO**, pulsando;
- a compatibilidade sobe em múltiplos de 13 e **sempre trava em 99%**, com o 1% restante atribuído à Era XIII;
- o progresso exibido é declarado pelo conteúdo, não calculado: ele sobe, "recalcula" e **desce** (73% → 18%, 91% → 89%);
- a Era VI oferece "VER RESPOSTA DE LUCAS" e responde ACESSO NEGADO, disponível na Era XIII;
- a Era VIII se apresenta como arquivo de análise e termina com "Status: AINDA NÃO ESCRITO".

O 100% aparece uma única vez no jogo inteiro: depois do "sim", na continuação que só o Lucas dispara.

Se alguma dessas peças for enfraquecida, a surpresa deixa de funcionar. `tests/era-catalog.test.ts` e `tests/game-machine.test.ts` protegem as mais frágeis.

### O falso reset

Depois da Era III o jogo exibe ERRO 13, glitcha, declara FALHA CRÍTICA e reexibe a introdução inteira. **Nada é apagado**: só o campo `fakeResetStage` avança no `localStorage`. Isso é deliberado — fechar o navegador no meio do susto não pode virar um susto de verdade. Há teste para isso.

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

## Recomeçar do zero

O jogo é de mão única de propósito: a sequência final não anda para trás e a tela "Olha para ele." não tem botão nenhum. Isso protege a noite, mas deixaria você sem saída na hora de testar — em produção não existe painel de dev. Então há dois caminhos, nenhum deles visível na interface:

1. **Abra a URL com `?reiniciar`** — por exemplo `https://<projeto>.vercel.app/?reiniciar`. O progresso é apagado e o jogo volta ao boot. O token some da barra de endereço logo depois, então um F5 seguinte **não** apaga de novo. Também funciona como `#reiniciar`, forma que sobrevive a apps de mensagem que reescrevem a query string.
2. **Toque longo de 4 s no canto inferior esquerdo da última tela** (a do NAMORADOS). É o canto oposto ao gatilho do final, e o tempo é o dobro, justamente para os dois gestos nunca se confundirem.

O segundo caminho só existe depois do NAMORADOS — quando não há mais nada a estragar. Em nenhum momento antes disso existe uma forma de voltar.

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
  playerTwoRealName: "Cauã",          // o nome de verdade, usado nos momentos sinceros
  playerTwoJokeName: "Cacau Nazaret", // a "correção" que o sistema insiste em aplicar
  startDate: "08.08.2026",
  noButtonAttempts: 8,
  storageKey: "project-next-era-progress",
  totalEras: 13,               // quantas Eras o jogo aparenta ter
  longLiveThreshold: 7,        // achievements para destravar o "Long Live"
  finalTriggerHoldMs: 2000,    // duração do toque longo que destrava o final
  finalTriggerFallbackMs: 240000, // rede de segurança, caso o gesto falhe
};
```

O mesmo arquivo tem `observationLines`, um espaço central para novas falas de observação do narrador, sem tocar em nenhum componente. O texto do final — a sua declaração — fica isolado em [`src/content/final-script.ts`](src/content/final-script.ts), que é a única parte pensada para você reescrever com calma.

As cores/tipografia/textura de cada Era estão em [`src/config/themes.ts`](src/config/themes.ts).

## Modo de desenvolvimento

Desligado por padrão. Para ativar localmente (nunca em produção):

```bash
# .env.local
NEXT_PUBLIC_ENABLE_DEV_TOOLS=true
```

Com a flag ativa, um botão **DEV** aparece no canto inferior direito, permitindo pular para qualquer Era, limpar o progresso, mover a etapa do falso reset e forçar cada etapa da sequência final. O atalho **Ensaiar "Olha para ele."** existe por um motivo prático: o toque longo que destrava o final precisa ser treinado sem jogar as oito Eras antes. Confirme que `NEXT_PUBLIC_ENABLE_DEV_TOOLS` **não** está definida (ou está `false`) antes de publicar.

## Arquitetura

```
docs/roteiro/
  DIRECAO-DEFINITIVA.md  Fonte de verdade atual
  NOVO-FLUXO-13-ERAS.md  Roteiro anterior, preservado como histórico
  ERA * .md              Roteiro original, preservado como histórico
src/
  app/                   page.tsx, layout.tsx (fontes + comentário escondido), globals.css
  components/game/       Telas e componentes; minigames/ tem os minijogos
  content/               Conteúdo tipado das 8 Eras + catálogo das 13
  config/                projectConfig + temas por Era
  hooks/                 useGameProgress (estado + persistência), useReducedMotion
  lib/                   storage.ts, game-machine.ts (reducer puro), no-button.ts, patience.ts, audio.ts
  types/                 Tipos centrais (GameProgress, EraDefinition, EraScreen, ...)
tests/                   Máquina de estados, catálogo das Eras e botão "Não"
```

A máquina de estados (`src/lib/game-machine.ts`) é um reducer puro e testável. Cada Era avança por cenas (`ERA_SCENE_ADVANCE`) e, ao terminar a última, `ERA_COMPLETE` libera a seguinte imediatamente. Só as Eras 1 a 8 têm conteúdo; as 9 a 13 vivem apenas em `src/content/era-catalog.ts` e nunca saem de `locked`.

A sequência final é guardada em `finalStage` (`playing` → `confession` → `eraXiii` → `transferring` → `lookAtHim` → `answered`) e **persistida**. O reducer recusa retrocessos: recarregar a página depois do ENCERRAR não devolve o jogador ao jogo nem repete a confissão. Só `DEV_SET_FINAL_STAGE`, do painel de desenvolvimento, move a etapa livremente — é o que permite ensaiar.

A tela **"Olha para ele."** não tem nenhuma interação visível. O que existe é um alvo invisível no canto inferior direito: um toque longo de 2 s dispara a continuação. Se o gesto falhar na hora, um timer de segurança (`finalTriggerFallbackMs`, 4 min) dispara sozinho — um gesto errado sob pressão não pode deixar a noite travada numa tela.

## Som

Desligado por padrão e opcional em tudo. Os efeitos são sintetizados na hora com a Web Audio API (`src/lib/audio.ts`) — nenhum arquivo, nenhuma requisição de rede e nada protegido por direitos autorais. O controle fica no menu do topo (`SoundToggle`), com `aria-label`, e some por completo na sequência final, onde não pode existir nenhuma opção na tela.

## Prototipagem visual

O sistema de temas e as telas-chave foram prototipados antes da implementação em um arquivo Figma (design system das 8 Eras + telas representativas: boot, convite, botão "Não", Termos de Uso, Era I completa, indicador de compatibilidade, sequência final da Era VIII), usado como referência visual durante o desenvolvimento.

## Sobre o texto e o roteiro

Falas do narrador, perguntas, respostas, badges e easter eggs vivem em `src/content/*.ts`, nunca dentro de JSX. Os arquivos de `docs/roteiro/` são a origem e **não devem ser alterados**. Nada de material protegido: sem áudio, arte ou letra da Taylor Swift — nomes de álbuns e músicas aparecem apenas como texto. Dois emojis são permitidos na interface: 🏆 nas conquistas e 🖕 na quinta tentativa de abrir a Era XIII.
