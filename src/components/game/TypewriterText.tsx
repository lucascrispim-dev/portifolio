"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type TypewriterTextProps = {
  text: string;
  speedMs?: number;
  instant?: boolean;
  onDone?: () => void;
  className?: string;
  showCursor?: boolean;
};

/** Revela `text` caractere a caractere. Respeita prefers-reduced-motion. */
export function TypewriterText({
  text,
  speedMs = 22,
  instant = false,
  onDone,
  className,
  showCursor = true,
}: TypewriterTextProps) {
  const reducedMotion = useReducedMotion();
  const skip = instant || reducedMotion;
  const [visibleChars, setVisibleChars] = useState(() => (skip ? text.length : 0));
  const onDoneRef = useRef(onDone);

  useEffect(() => {
    onDoneRef.current = onDone;
  });

  useEffect(() => {
    if (skip) {
      onDoneRef.current?.();
      return;
    }

    let index = 0;
    const interval = setInterval(() => {
      index += 1;
      setVisibleChars(index);
      if (index >= text.length) {
        clearInterval(interval);
        onDoneRef.current?.();
      }
    }, speedMs);

    return () => clearInterval(interval);
  }, [text, speedMs, skip]);

  const done = visibleChars >= text.length;

  return (
    <span className={className}>
      {text.slice(0, visibleChars)}
      {showCursor && !done ? (
        <span aria-hidden className="animate-pulse">
          _
        </span>
      ) : null}
    </span>
  );
}
