"use client";

import { useState } from "react";
import { PLAYABLE_ERA_IDS } from "@/types/game";
import type { FinalStage, GameProgress, PlayableEraId } from "@/types/game";
import { eraDefinitions } from "@/content/eras";
import type { GameAction } from "@/lib/game-machine";

const FINAL_STAGES: FinalStage[] = [
  "playing",
  "interrupted",
  "transferring",
  "final",
];

/**
 * Painel de desenvolvimento — nunca deve aparecer na versão usada pelo
 * jogador. Só é montado quando NEXT_PUBLIC_ENABLE_DEV_TOOLS=true, e essa
 * checagem acontece em page.tsx, antes deste componente ser renderizado.
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
          <p className="mb-3 leading-relaxed opacity-70">
            Era {progress.currentEra} · cena{" "}
            {progress.eraSceneIndex[progress.currentEra]} · final:{" "}
            {progress.finalStage}
            <br />
            achievements: {progress.achievements.length} · eggs:{" "}
            {progress.easterEggs.length}
          </p>

          <button
            type="button"
            className="mb-3 min-h-11 w-full rounded-lg bg-red-700 px-3 py-2"
            onClick={() => dispatch({ type: "DEV_RESET" })}
          >
            Limpar progresso
          </button>

          <p className="mb-1 opacity-60">Ir para a Era:</p>
          <div className="mb-3 grid grid-cols-4 gap-1">
            {PLAYABLE_ERA_IDS.map((eraId: PlayableEraId) => (
              <button
                key={eraId}
                type="button"
                className={`min-h-11 rounded-lg px-2 py-1 ${
                  progress.currentEra === eraId ? "bg-white text-black" : "bg-neutral-700"
                }`}
                onClick={() => dispatch({ type: "DEV_SET_ERA", era: eraId })}
              >
                {eraId}
              </button>
            ))}
          </div>
          <p className="mb-3 opacity-50">
            {eraDefinitions[progress.currentEra].title}
          </p>

          <p className="mb-1 opacity-60">Sequência final:</p>
          <select
            aria-label="Etapa da sequência final"
            className="min-h-11 w-full rounded bg-neutral-800 px-2 py-1"
            value={progress.finalStage}
            onChange={(event) =>
              dispatch({
                type: "SET_FINAL_STAGE",
                stage: event.target.value as FinalStage,
              })
            }
          >
            {FINAL_STAGES.map((stage) => (
              <option key={stage} value={stage}>
                {stage}
              </option>
            ))}
          </select>
        </div>
      ) : null}
    </div>
  );
}
