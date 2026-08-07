# DIREÇÃO DEFINITIVA — PROJECT: NEXT ERA

> Documento de trabalho. Os arquivos `ERA * • *.md` deste diretório são o
> roteiro original e **não devem ser alterados**. Este aqui descreve a
> direção que o código implementa hoje.

## O que o jogo é

Uma noite de 30 a 40 minutos, no celular, com uma pessoa só: o Cauã.
O jogo se apresenta como um sistema sério que analisa a relação de vocês
dois. Ele é, na prática, um sabotador — e essa é a graça.

Três regras estruturais:

1. **O sistema mente.** O progresso sobe, desce e "recalcula". A
   compatibilidade nunca fecha em 100%. A paciência dele é medida e o
   número só cai.
2. **O sistema provoca.** O nome verdadeiro é recusado e "corrigido" para
   Cacau Nazaret. A Era XIII é oferecida a cada tela e negada a cada
   toque. Um botão "Não" foge oito vezes e explode.
3. **O sistema quebra.** Depois da Era III ele finge corromper os dados,
   reinicia do zero e devolve tudo — só para provar que podia.

## Estrutura

| Etapa | O que acontece |
|---|---|
| Introdução | Boot, classificação confidencial, convite, botão "Não" que foge 8× e explode (🏆 PERSISTÊNCIA QUESTIONÁVEL), termos de uso, "Bem-vindo, Cacau Nazaret." |
| Era I — Begin Again | Pergunta o nome e o recusa; escala de 1 a 13; OUR/SONG; medidor de Taylor Swift em EXCESSIVA. Progresso: 8% → "recalculando" → 41% |
| Era II — Fearless | Toy Story, Villa-Lobos, pizza, Toy Story de novo; LOVE + STORY. Progresso: 73% → 18% |
| Era III — Speak Now | Duas perguntas abertas; o celular é entregue ao Lucas (escolha A/B/C secreta); treze estrelas, a última foge três vezes. **Termina em ERRO 13.** |
| ERRO 13 | Salvando → 99% → trava → glitch → FALHA CRÍTICA → REINICIAR → a introdução inteira de novo. Desta vez o "Não" fica parado e ele consegue clicar → "Dessa vez você conseguiu. Mas não importa." → "VOCÊ REALMENTE ACHOU QUE EU TINHA APAGADO TUDO?" → progresso restaurado (🏆 BAD IDEA RIGHT?) |
| Era IV — Red | "Não aconteceu nada. Você imaginou."; Augusta; banheiro trancado (🏆 MIJÃO). Progresso: INDETERMINADO → 52% |
| Era V — 1989 | Leite; labirinto que sempre volta ao começo (🏆 OUT OF THE WOODS); São Paulo FC ou ERRO; pênalti que só entra na terceira (🏆 TRICOLOR). Progresso: 60% → 60% |
| Era VI — reputation | Villa-Lobos; Call It What You Want; a pergunta do sentimento; "VER RESPOSTA DE LUCAS" → ACESSO NEGADO, disponível na Era XIII. Progresso: 77% |
| Era VII — Lover | Leve de propósito. Quatro anéis de papel que se recusam a colaborar (🏆 PAPER RINGS). Progresso: 91% → 89% ("Você regrediu.") |
| Era VIII — folklore | O fio invisível, ponto a ponto, terminando em 99% e em "Estimativa de resolução: ERA XIII" (🏆 INVISIBLE STRING). Termina em SALVAR E ENCERRAR — o falso fim. |
| Confissão | O narrador se dissolve: ORIGEM DE DADOS migra de Narrador 71% para Lucas 100%. O texto vira primeira pessoa. Termina em "Você é o homem da minha vida." |
| Era XIII | As Eras IX a XII somem do mapa; a XIII abre; "Requisito identificado: UMA RESPOSTA"; a barra sobe até 99% e dá ERRO; controle transferido para o Lucas. |
| "Olha para ele." | Tela terminal. Sem botão, sem contador, sem interação visível. O pedido acontece fora da tela. |
| Depois do "sim" | Disparada pelo Lucas: RESPOSTA RECEBIDA → SIM → confetes → COMPATIBILIDADE 100% (a única vez) → "O 1% nunca foi um cálculo. Era uma resposta." → ERA XIII / THE NEXT ERA / INICIADA / 08.08.2026 → "Call It What You Want. Eu já sei como quero chamar." → NAMORADOS (🏆 THE NEXT ERA) |

## Decisões que não podem mudar sem quebrar o projeto

- **O falso reset não apaga nada.** Só `fakeResetStage` muda no
  `localStorage`. Fechar o navegador no meio do susto não pode virar um
  susto de verdade (`tests/game-machine.test.ts`).
- **`finalStage` nunca anda para trás.** Recarregar a página depois do
  ENCERRAR não devolve ninguém ao jogo nem repete a confissão. Só
  `DEV_SET_FINAL_STAGE` (painel de desenvolvimento) move livremente, e
  existe para ensaiar.
- **As Eras IX a XIII nunca destravam.** Nem no fim, nem no painel de dev,
  nem depois da confissão.
- **A tela "Olha para ele." não tem interação visível.** O gatilho é um
  toque longo de 2 s no canto inferior direito, invisível e sem rótulo.
- **Existe um timer de segurança.** Se o toque longo não acontecer, a
  continuação dispara sozinha depois de `finalTriggerFallbackMs` (4 min).
  Um gesto errado sob pressão não pode deixar a noite travada numa tela.
- **Nada de material protegido.** Sem áudio, arte ou letra da Taylor
  Swift. Os efeitos sonoros são osciladores gerados em tempo de execução;
  os nomes de álbuns e músicas são citados como texto, nada mais.
- **Dois emojis, só.** 🏆 nas conquistas e 🖕 na quinta tentativa de abrir
  a Era XIII.

## Recomeçar do zero

Testar de novo precisa ser possível sem quebrar a regra de mão única. Dois caminhos, nenhum visível:

- **`?reiniciar` na URL** (ou `#reiniciar`) apaga o progresso e volta ao boot, de qualquer etapa. O token é removido da barra de endereço em seguida, para que um F5 não apague outra vez.
- **Toque longo de 4 s no canto inferior esquerdo da tela do NAMORADOS** — canto oposto e tempo dobrado em relação ao gatilho do final, para que os dois gestos nunca se confundam. Só existe nessa tela.

O que **não** pode acontecer: um caminho de volta em qualquer momento anterior. Depois do ENCERRAR não há como voltar ao jogo, e a tela "Olha para ele." continua sem nenhuma interação visível.

## Como ensaiar

`NEXT_PUBLIC_ENABLE_DEV_TOOLS=true npm run dev` monta o painel DEV no canto
inferior direito: pular para qualquer Era, mover a sequência final e —
o mais importante — **Ensaiar "Olha para ele."**, que vai direto para a
tela terminal para treinar o toque longo. O painel nunca é montado sem
essa variável, então não existe na versão publicada.
