"use client";

import { ProgressBar } from "@/components/game/ProgressBar";

export function LoadingSequence({
  label,
  durationMs = 900,
  onDone,
}: {
  label: string;
  durationMs?: number;
  onDone?: () => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <p className="font-mono text-sm opacity-80">{label}</p>
      <ProgressBar durationMs={durationMs} onDone={onDone} />
    </div>
  );
}
