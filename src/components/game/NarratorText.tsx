"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { TypewriterText } from "@/components/game/TypewriterText";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { NarratorLine } from "@/types/game";

const PAUSE_MS: Record<NonNullable<NarratorLine["pause"]>, number> = {
  short: 500,
  long: 1100,
};

type NarratorTextProps = {
  lines: NarratorLine[];
  onDone?: () => void;
  className?: string;
  lineClassName?: string;
};

/**
 * Revela um bloco de falas do narrador em sequência, uma de cada vez,
 * com a pausa dramática indicada em cada linha. Usado por praticamente
 * toda tela de narração do jogo — a mecânica central da Era I é o
 * padrão conceitual para as demais (ver docs/roteiro). Cada instância é
 * montada com uma lista `lines` fixa (o chamador troca de tela via
 * `key`), então o estado inicial é derivado uma única vez no mount.
 */
export function NarratorText({
  lines,
  onDone,
  className,
  lineClassName,
}: NarratorTextProps) {
  const reducedMotion = useReducedMotion();
  const [visibleCount, setVisibleCount] = useState(() => (lines.length > 0 ? 1 : 0));
  const onDoneRef = useRef(onDone);

  useEffect(() => {
    onDoneRef.current = onDone;
  });

  useEffect(() => {
    if (lines.length === 0) onDoneRef.current?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleLineTyped(index: number) {
    const pause = lines[index].pause ? PAUSE_MS[lines[index].pause!] : 350;
    const wait = reducedMotion ? 0 : pause;

    if (index < lines.length - 1) {
      window.setTimeout(() => setVisibleCount((count) => count + 1), wait);
      return;
    }
    // A última linha também tem direito à sua pausa: sem isso, toda tela
    // que avança sozinha corta a própria frase final no instante em que
    // ela termina de ser digitada.
    window.setTimeout(() => onDoneRef.current?.(), wait);
  }

  return (
    <div className={className ?? "flex flex-col gap-3"}>
      {lines.slice(0, visibleCount).map((line, index) => (
        <motion.p
          key={`${index}-${line.text}`}
          initial={reducedMotion ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className={lineClassName ?? "whitespace-pre-line text-[17px] leading-relaxed"}
        >
          {index === visibleCount - 1 ? (
            <TypewriterText text={line.text} onDone={() => handleLineTyped(index)} />
          ) : (
            line.text
          )}
        </motion.p>
      ))}
    </div>
  );
}
