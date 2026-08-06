"use client";

import { DevToolsPanel } from "@/components/game/DevToolsPanel";
import { GameScreen } from "@/components/game/GameScreen";
import { useGameProgress } from "@/hooks/useGameProgress";

const DEV_TOOLS_ENABLED = process.env.NEXT_PUBLIC_ENABLE_DEV_TOOLS === "true";

export default function Home() {
  const { progress, dispatch } = useGameProgress();

  return (
    <>
      <GameScreen progress={progress} dispatch={dispatch} />
      {DEV_TOOLS_ENABLED ? <DevToolsPanel progress={progress} dispatch={dispatch} /> : null}
    </>
  );
}
