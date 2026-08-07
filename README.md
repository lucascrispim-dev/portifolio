# PROJECT: NEXT ERA

Uma experiência web narrativa, mobile-first, jogada de uma sentada (35 a 45 minutos). O jogo aparenta ter **13 Eras**, mas só as oito primeiras existem — e o sistema que as apresenta passa a noite inteira sabotando o próprio jogador: mente sobre o progresso, mede a paciência dele, recusa o nome dele, quebra de propósito e, depois da Era III, finge corromper os dados e reiniciar do zero. Depois da folklore o narrador se dissolve, o texto vira primeira pessoa e o controle passa para o Lucas. **O pedido não acontece no site.**

O objetivo declarado é que o jogador termine pensando *"eu nunca fazia ideia do que aquele site faria nos próximos 30 segundos"*. Tudo abaixo existe a serviço disso.

> **Fonte de verdade:** [`docs/roteiro/DIRECAO-DEFINITIVA.md`](docs/roteiro/DIRECAO-DEFINITIVA.md). Os arquivos `ERA * .md` e `NOVO-FLUXO-13-ERAS.md` ao lado dele documentam roteiros anteriores e ficam preservados como histórico — o código em `src/content/*.ts` deriva da direção definitiva.

## Stack

Next.js (App Router) · React 19 · TypeScript estrito · Tailwind CSS v4 · Framer Motion · `localStorage` · Vitest

Sem backend, sem banco de dados. Não há cronômetro, senha, localização, painel administrativo nem confirmação de acontecimentos externos: cada Era abre a próxima assim que o jogador termina as interações.

## O truque

Até o jogador tocar em **ENCERRAR**, tudo na tela sustenta que a história continua depois:

- o mapa abre listando **doze** Eras, com as Eras IX a XII já nomeadas com os álbuns seguintes (evermore, Midnights, The Tortured Poets Department, The Life of a Showgirl). A décima terceira **não existe até a Era III**, quando o narrador deixa escapar que ela existe e se censura tarde demais — só então o cartão **CLASSIFICADO** aparece no mapa, pulsando;
- a compatibilidade sobe em múltiplos de 13 e **sempre trava em 99%**, com o 1% restante atribuído à Era XIII;
- o progresso exibido é declarado pelo conteúdo, não calculado: ele sobe, "recalcula" e **desce** (73% → 18%, 91% → 89%);
- a Era VI oferece "VER RESPOSTA DE LUCAS" e responde ACESSO NEGADO, disponível na Era XIII;
- a Era VIII se apresenta como arquivo de análise e termina com "Status: AINDA NÃO ESCRITO".

O 100% aparece uma única vez no jogo inteiro: depois do "sim", na continuação que só o Lucas dispara.

Se alguma dessas peças for enfraquecida, a surpresa deixa de funcionar. `tests/era-catalog.test.ts` e `tests/game-machine.test.ts` protegem as mais frágeis.

### Cada Era é um sistema diferente

O maior risco do projeto era as oito Eras virarem a mesma Era pintada de oito cores. `src/config/personalities.ts` resolve isso mudando o **comportamento** do sistema, não a paleta: a velocidade com que o narrador digita, o rótulo de status no topo, as notificações que chegam sozinhas e os efeitos próprios de cada Era.

| Era | Como o sistema se comporta |
|---|---|
| I — Debut | Curioso. Monta um perfil do jogador, erra quase todos os campos e não corrige nenhum. |
| II — Fearless | Afobado. Digita mais rápido que qualquer outra Era, anuncia uma expedição e oferece três rotas que levam ao mesmo lugar. |
| III — Speak Now | Falante demais. Comenta o que não foi perguntado e acaba vazando a existência da Era XIII. |
| IV — Red | Instável. A tela treme sozinha em intervalos irregulares e as falhas roteirizadas se acumulam. |
| V — 1989 | Recém-atualizado. Instala a "versão 2.0" no meio do jogo, publica notas de versão e continua idêntico. |
| VI — reputation | Seco. Escreve em minúsculas, abre um processo formal contra o jogador e o condena em todas as acusações. |
| VII — Lover | Simpático\*. Elogia, se preocupa, promete pegar leve — e o asterisco cobra a fatura no fim da Era. |
| VIII — folklore | Silencioso. Digita quase parando, quase não notifica, e pede treze segundos de imobilidade sem provocar uma única vez. |

### Sistemas paralelos

Rodando o tempo todo, por baixo das Eras — todos acessíveis pelo menu, nenhum deles alterando o jogo:

- **Inventário.** Onze objetos coletados ao longo das Eras, cada um apresentado com moldura, nome em caixa alta e laudo técnico. Nenhum tem função, e o menu responde a quem for conferir: *"Utilidade: a ser determinada."* O significado só aparece na última tela, depois do "sim".
- **Arquivos secretos.** Anotações internas do sistema sobre o jogador e sobre o Lucas. A numeração pula de propósito, e o `ARQUIVO 013` fica visível na lista desde o começo sem nunca abrir.
- **Falhas.** ERRO 08, ERRO 22, DADOS CORROMPIDOS, RECONECTANDO, VERSÃO INCOMPATÍVEL — cada uma posicionada numa Era específica, sem nada para o jogador fazer além de assistir. É a repetição delas que dá ao ERRO 13 chance real de enganar.
- **Notificações.** Uma fila só, empilhada, alimentada pelos eventos ambientes de cada Era, pelos easter eggs e pelos avisos do sistema. É o que faz o jogo parecer sempre ocupado com alguma coisa enquanto o jogador só lê.
- **Estatísticas.** Tempo de sessão, toques, perguntas respondidas, falhas presenciadas, acessos negados — e, no rodapé, "Mentiras contadas: 0".

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
npm run test        # Vitest — máquina de estados, catálogo, sistemas paralelos e Era XIII
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

O mesmo arquivo tem `observationLines`: as falas que o narrador solta sozinho a cada 39 toques, para lembrar o jogador de que tem alguém prestando atenção. Acrescentar uma frase ali basta — nenhum componente precisa ser tocado.

O texto do final — a sua declaração — fica isolado em [`src/content/final-script.ts`](src/content/final-script.ts), que é a única parte pensada para você reescrever com calma.

Onde mexer em cada coisa:

| O quê | Arquivo |
|---|---|
| Cores, tipografia e textura de cada Era | [`src/config/themes.ts`](src/config/themes.ts) |
| Comportamento do sistema em cada Era (ritmo, rótulo, notificações) | [`src/config/personalities.ts`](src/config/personalities.ts) |
| Itens do inventário e seus laudos inúteis | [`src/content/inventory.ts`](src/content/inventory.ts) |
| Arquivos secretos | [`src/content/secret-files.ts`](src/content/secret-files.ts) |
| Falhas roteirizadas do sistema | [`src/content/system-errors.ts`](src/content/system-errors.ts) |
| Telas de cada Era | `src/content/era-1.ts` … `era-8.ts` |

## Modo de desenvolvimento

Desligado por padrão. Para ativar localmente (nunca em produção):

```bash
# .env.local
NEXT_PUBLIC_ENABLE_DEV_TOOLS=true
```

Com a flag ativa, um botão **DEV** aparece no canto inferior direito, permitindo pular para qualquer Era, limpar o progresso, mover a etapa do falso reset, revelar a Era XIII no mapa sem passar pelo vazamento da Era III e forçar cada etapa da sequência final. O atalho **Ensaiar "Olha para ele."** existe por um motivo prático: o toque longo que destrava o final precisa ser treinado sem jogar as oito Eras antes. Confirme que `NEXT_PUBLIC_ENABLE_DEV_TOOLS` **não** está definida (ou está `false`) antes de publicar.

## Arquitetura

```
docs/roteiro/
  DIRECAO-DEFINITIVA.md  Fonte de verdade atual
  NOVO-FLUXO-13-ERAS.md  Roteiro anterior, preservado como histórico
  ERA * .md              Roteiro original, preservado como histórico
src/
  app/                   page.tsx, layout.tsx (fontes + comentário escondido), globals.css
  components/game/       Telas e componentes; minigames/ tem os minijogos
  content/               Conteúdo tipado das 8 Eras + catálogo das 13, inventário,
                         arquivos secretos e falhas do sistema
  config/                projectConfig, temas por Era e personalities.ts (comportamento por Era)
  hooks/                 useGameProgress (estado + persistência), useSessionStats, useReducedMotion
  lib/                   storage.ts, game-machine.ts (reducer puro), no-button.ts, patience.ts, audio.ts
  types/                 Tipos centrais (GameProgress, EraDefinition, EraScreen, ...)
tests/                   Máquina de estados, catálogo das Eras, botão "Não",
                         sistemas paralelos e a descoberta da Era XIII
```

A máquina de estados (`src/lib/game-machine.ts`) é um reducer puro e testável. Cada Era avança por cenas (`ERA_SCENE_ADVANCE`) e, ao terminar a última, `ERA_COMPLETE` libera a seguinte imediatamente. Só as Eras 1 a 8 têm conteúdo; as 9 a 13 vivem apenas em `src/content/era-catalog.ts` e nunca saem de `locked`.

`ERA_SCENE_ADVANCE` exige declarar de qual cena se está saindo (`fromScene`) e nunca passa da última. Isso não é zelo abstrato: sem o primeiro guarda, dois toques rápidos no mesmo "CONTINUAR" avançavam duas cenas — o botão da tela que está saindo continua clicável durante a animação — e o jogador perdia um item, um arquivo ou uma pergunta inteira sem nunca ver a tela; sem o segundo, um avanço a mais deixava uma tela em branco sem saída. O jogo provoca o jogador por clicar rápido demais, então é exatamente isso que ele faz.

A sequência final é guardada em `finalStage` (`playing` → `confession` → `eraXiii` → `transferring` → `lookAtHim` → `answered`) e **persistida**. O reducer recusa retrocessos: recarregar a página depois do ENCERRAR não devolve o jogador ao jogo nem repete a confissão. Só `DEV_SET_FINAL_STAGE`, do painel de desenvolvimento, move a etapa livremente — é o que permite ensaiar.

A tela **"Olha para ele."** não tem nenhuma interação visível. O que existe é um alvo invisível no canto inferior direito: um toque longo de 2 s dispara a continuação. Se o gesto falhar na hora, um timer de segurança (`finalTriggerFallbackMs`, 4 min) dispara sozinho — um gesto errado sob pressão não pode deixar a noite travada numa tela.

## Som

Desligado por padrão e opcional em tudo. Os efeitos são sintetizados na hora com a Web Audio API (`src/lib/audio.ts`) — nenhum arquivo, nenhuma requisição de rede e nada protegido por direitos autorais. O controle fica no menu do topo (`SoundToggle`), com `aria-label`, e some por completo na sequência final, onde não pode existir nenhuma opção na tela.

## Prototipagem visual

O sistema de temas e as telas-chave foram prototipados antes da implementação em um arquivo Figma (design system das 8 Eras + telas representativas: boot, convite, botão "Não", Termos de Uso, Era I completa, indicador de compatibilidade, sequência final da Era VIII), usado como referência visual durante o desenvolvimento.

## Sobre o texto e o roteiro

Falas do narrador, perguntas, respostas, badges e easter eggs vivem em `src/content/*.ts`, nunca dentro de JSX. Os arquivos de `docs/roteiro/` são a origem e **não devem ser alterados**. Nada de material protegido: sem áudio, arte ou letra da Taylor Swift — nomes de álbuns e músicas aparecem apenas como texto. Dois emojis são permitidos na interface: 🏆 nas conquistas e 🖕 na quinta tentativa de abrir a Era XIII.
