"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Toque longo. Existe porque as duas ações mais delicadas do projeto —
 * destravar a continuação depois do "sim" e recomeçar do zero — não podem
 * ter botão visível, mas também não podem disparar por encostar na tela.
 *
 * Dispara uma única vez por montagem.
 */
export function useLongPress(onFire: () => void, holdMs: number) {
  const firedRef = useRef(false);
  const timerRef = useRef<number | null>(null);
  const onFireRef = useRef(onFire);
  const [holding, setHolding] = useState(false);

  useEffect(() => {
    onFireRef.current = onFire;
  });

  function cancel() {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setHolding(false);
  }

  function start() {
    if (firedRef.current || timerRef.current !== null) return;
    setHolding(true);
    timerRef.current = window.setTimeout(() => {
      timerRef.current = null;
      setHolding(false);
      if (firedRef.current) return;
      firedRef.current = true;
      onFireRef.current();
    }, holdMs);
  }

  useEffect(() => () => cancel(), []);

  return {
    holding,
    /** Dispara o gatilho imediatamente, sem esperar o toque. */
    fireNow: () => {
      if (firedRef.current) return;
      firedRef.current = true;
      onFireRef.current();
    },
    handlers: {
      onPointerDown: start,
      onPointerUp: cancel,
      onPointerCancel: cancel,
      onPointerLeave: cancel,
      onContextMenu: (event: { preventDefault: () => void }) =>
        event.preventDefault(),
    },
  };
}
