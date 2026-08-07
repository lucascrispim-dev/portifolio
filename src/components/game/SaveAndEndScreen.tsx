"use client";

import { useState } from "react";
import { ChoiceButton } from "@/components/game/ChoiceButton";
import { NarratorText } from "@/components/game/NarratorText";
import { SystemBlock } from "@/components/game/SystemBlock";

/**
 * Última tela antes da virada. Tudo aqui existe para convencer o jogador
 * de que o jogo vai apenas pausar até as Eras IX a XIII existirem — e é
 * o "ENCERRAR" que dispara a interrupção.
 */
export function SaveAndEndScreen({ onEnd }: { onEnd: () => void }) {
  const [saved, setSaved] = useState(false);

  return (
    <div className="flex flex-1 flex-col justify-center gap-6">
      <SystemBlock
        lines={[
          "ERA VIII CONCLUÍDA",
          "Progresso: 8 de 13",
          "Próximo arquivo: ERA IX",
          "Status: AINDA NÃO ESCRITO",
        ]}
      />

      <NarratorText
        lines={[
          {
            text: "As Eras IX a XIII\nserão disponibilizadas\nem uma futura atualização.",
            pause: "long",
          },
        ]}
      />

      {!saved ? (
        <ChoiceButton onClick={() => setSaved(true)}>SALVAR PROGRESSO</ChoiceButton>
      ) : (
        <div className="flex flex-col gap-5">
          <NarratorText
            lines={[
              { text: "Progresso salvo.", pause: "short" },
              {
                text: "Você poderá continuar\nquando o próximo capítulo existir.",
                pause: "long",
              },
            ]}
          />
          <ChoiceButton onClick={onEnd}>ENCERRAR</ChoiceButton>
        </div>
      )}
    </div>
  );
}
