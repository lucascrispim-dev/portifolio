# PROJECT: NEXT ERA

Uma experiência web mobile-first, narrativa, de um único dia — oito Eras inspiradas em álbuns da Taylor Swift que terminam transferindo o controle para o Lucas. **O pedido de namoro não acontece no site.**

> O roteiro completo (introdução + as 8 Eras) está documentado em [`docs/roteiro/`](docs/roteiro). Esses arquivos são a fonte de verdade do conteúdo narrativo e não devem ser modificados — apenas o código em `src/content/*.ts` é derivado deles.

## Stack

Next.js (App Router) · React 19 · TypeScript estrito · Tailwind CSS v4 · Framer Motion · `localStorage` · Vitest

Sem backend, sem banco de dados. O jogo não mede o tempo — ele mede a história: a progressão acontece por eventos narrativos confirmados pelo jogador, nunca por cronômetro, senha, localização ou painel administrativo.

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

Pronto para deploy na [Vercel](https://vercel.com) sem configuração adicional.

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
  playerTwoName: "[Nome dele]", // troque aqui — não precisa procurar em outros arquivos
  symbolicDate: "08/08",
  noButtonAttempts: 8,
  storageKey: "project-next-era-progress",
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

Com a flag ativa, um botão **DEV** aparece no canto inferior direito, permitindo: navegar entre Eras, limpar o progresso salvo e simular os estados `waiting_for_event` / `completed` de qualquer Era — sem senha visível dentro do jogo. Confirme que `NEXT_PUBLIC_ENABLE_DEV_TOOLS` **não** está definida (ou está `false`) antes de publicar.

## Arquitetura

```
docs/roteiro/          Roteiro narrativo canônico (introdução + 8 Eras), não modificar
src/
  app/                 page.tsx, layout.tsx (fontes via next/font), globals.css
  components/game/     Componentes de UI reutilizáveis (tema, narrador, botões, etc.)
  content/              Conteúdo tipado de cada Era, separado da UI
  config/               projectConfig + sistema de temas
  hooks/                useGameProgress (estado + persistência), useReducedMotion
  lib/                  storage.ts, game-machine.ts (reducer puro), no-button.ts, events.ts
  types/                Tipos centrais (GameProgress, EraDefinition, EraScreen, ...)
tests/                  Testes da máquina de estados e do botão "Não"
```

A máquina de estados (`src/lib/game-machine.ts`) é um reducer puro e testável: cada Era avança por cenas (`ERA_SCENE_ADVANCE`) até uma missão; ao aceitar a missão a Era entra em `waiting_for_event`; reabrir o app pergunta se o acontecimento já ocorreu — "ainda não" mantém a Era pendente, confirmar libera apenas a próxima Era. A Era VII conclui automaticamente (não tem missão offline própria, ver nota em `docs/roteiro/ERA VII • Lover.md`); a Era VIII é terminal e não usa esse gate.

### Espera e reabertura

Aceitar a missão leva a uma **tela mínima de espera** (`StandbyScreen`) — o jogo sai do caminho e manda o jogador viver o acontecimento. A pergunta *"já aconteceu?"* só aparece quando o app é **reaberto**, que é o que sustenta a regra central do projeto ("o jogo não mede o tempo, ele mede a história").

Duas formas de reabrir contam, porque o roteiro manda guardar o celular:

- recarregar a página (sessão nova); ou
- bloquear o celular e voltar — detectado por `visibilitychange` em `src/hooks/useReopenSignal.ts`, já que voltar de segundo plano **não** recarrega a página.

O standby é estado de sessão e **não** vai para o `localStorage`: o que persiste é apenas `waiting_for_event`.

## Som

Desligado por padrão e opcional em tudo. Os efeitos são sintetizados na hora com a Web Audio API (`src/lib/audio.ts`) — nenhum arquivo, nenhuma requisição de rede e nada protegido por direitos autorais. O controle fica no canto superior direito (`SoundToggle`), com `aria-label`, e some por completo na sequência final da Era VIII, onde não pode existir nenhuma opção na tela.

## Prototipagem visual

O sistema de temas e as telas-chave foram prototipados antes da implementação em um arquivo Figma (design system das 8 Eras + telas representativas: boot, convite, botão "Não", Termos de Uso, Era I completa, indicador de compatibilidade, sequência final da Era VIII), usado como referência visual durante o desenvolvimento.

## Sobre o texto e o roteiro

Falas do narrador, perguntas, respostas, badges, missões e easter eggs em `src/content/*.ts` são reproduzidos verbatim de `docs/roteiro/`. Apenas o "chrome" estrutural de retorno ao app (ex.: "Você voltou... já aconteceu?") foi adaptado por Era a partir do padrão estabelecido pela Era I, conforme instruído no roteiro — nenhum texto narrativo principal foi inventado.
