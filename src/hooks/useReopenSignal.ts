"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Conta quantas vezes o jogador "reabriu" o aplicativo sem recarregar a
 * página.
 *
 * O roteiro pede que o jogador guarde/bloqueie o celular durante as
 * missões. Voltar de um app em segundo plano não recarrega a página, então
 * depender só de reload deixaria o jogador preso na tela de espera. Aqui
 * observamos `visibilitychange`: o contador sobe quando o documento volta a
 * ficar visível **depois** de ter ficado oculto.
 *
 * É um contador, e não um booleano, para que cada reabertura seja
 * distinguível da anterior — assim uma Era que entra em espera *depois* de
 * uma reabertura não é encerrada pelo sinal antigo.
 *
 * `minHiddenMs` evita que uma troca de aba de meio segundo conte como
 * "voltei da vida real".
 */
export function useReopenSignal(minHiddenMs = 3000): number {
  const [reopenCount, setReopenCount] = useState(0);
  const hiddenSinceRef = useRef<number | null>(null);

  useEffect(() => {
    function handleVisibilityChange() {
      if (document.visibilityState === "hidden") {
        hiddenSinceRef.current = Date.now();
        return;
      }

      const hiddenSince = hiddenSinceRef.current;
      hiddenSinceRef.current = null;
      if (hiddenSince !== null && Date.now() - hiddenSince >= minHiddenMs) {
        setReopenCount((count) => count + 1);
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [minHiddenMs]);

  return reopenCount;
}
