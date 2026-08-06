"use client";

import { TypewriterText } from "@/components/game/TypewriterText";

/** Linha de "chrome" do sistema — usada no boot e nas reaberturas entre Eras. */
export function SystemMessage({
  text,
  onDone,
  className = "font-mono text-sm text-neutral-400",
}: {
  text: string;
  onDone?: () => void;
  className?: string;
}) {
  return (
    <div className={className}>
      <TypewriterText text={text} speedMs={16} onDone={onDone} showCursor={false} />
    </div>
  );
}
