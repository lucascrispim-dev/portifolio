"use client";

import { useState } from "react";
import { ERA_IDS } from "@/types/game";
import type { EraId, EraStatus, GameProgress } from "@/types/game";
import type { GameAction } from "@/lib/game-machine";

const STATUSES: EraStatus[] = [
  "locked",
  "available",
  "active",
  "waiting_for_event",
  "confirming_event",
  "completed",
];

/**
 * Painel de desenvolvimento — nunca deve aparecer na versão normal
 * usada pelo jogador. Só é montado quando
 * NEXT_PUBLIC_ENABLE_DEV_TOOLS=true (ver page.tsx), e essa checagem
 * acontece antes deste componente sequer ser importado/renderizado.
 */
export function DevToolsPanel({
  progress,
  dispatch,
}: {
  progress: GameProgress;
  dispatch: (action: GameAction) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-3 right-3 z-[999] font-mono text-xs">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="min-h-11 rounded-full bg-black/80 px-4 py-2 text-white shadow-lg"
      >
        DEV
      </button>

      {open ? (
        <div className="mt-2 max-h-[70vh] w-72 overflow-y-auto rounded-xl bg-black/90 p-4 text-white shadow-xl">
          <p className="mb-2 opacity-70">
            currentEra: {progress.currentEra} · introCompleted:{" "}
            {String(progress.introCompleted)}
          </p>

          <button
            type="button"
            className="mb-3 min-h-11 w-full rounded-lg bg-red-700 px-3 py-2"
            onClick={() => dispatch({ type: "DEV_RESET" })}
          >
            Limpar progresso (reset total)
          </button>

          <button
            type="button"
            className="mb-3 min-h-11 w-full rounded-lg bg-neutral-700 px-3 py-2"
            onClick={() => dispatch({ type: "DEV_UNLOCK_ALL" })}
          >
            Desbloquear todas as Eras
          </button>

          <div className="flex flex-col gap-3">
            {ERA_IDS.map((eraId) => (
              <EraDevRow
                key={eraId}
                eraId={eraId}
                status={progress.eraStatuses[eraId]}
                isCurrent={progress.currentEra === eraId}
                dispatch={dispatch}
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function EraDevRow({
  eraId,
  status,
  isCurrent,
  dispatch,
}: {
  eraId: EraId;
  status: EraStatus;
  isCurrent: boolean;
  dispatch: (action: GameAction) => void;
}) {
  return (
    <div className={`rounded-lg border p-2 ${isCurrent ? "border-white" : "border-white/20"}`}>
      <p className="mb-1">
        Era {eraId} — <span className="opacity-70">{status}</span>
      </p>
      <select
        aria-label={`Status da Era ${eraId}`}
        className="min-h-11 w-full rounded bg-neutral-800 px-2 py-1"
        value={status}
        onChange={(event) =>
          dispatch({
            type: "DEV_SET_ERA_STATUS",
            era: eraId,
            status: event.target.value as EraStatus,
          })
        }
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    </div>
  );
}
