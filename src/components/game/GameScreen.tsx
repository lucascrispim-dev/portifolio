"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AppShell } from "@/components/game/AppShell";
import { BadgeCard } from "@/components/game/BadgeCard";
import { ChoiceButton } from "@/components/game/ChoiceButton";
import { CompatibilityMeter } from "@/components/game/CompatibilityMeter";
import { EraIntro } from "@/components/game/EraIntro";
import { EraThemeProvider } from "@/components/game/EraThemeProvider";
import { EventConfirmation } from "@/components/game/EventConfirmation";
import { FinalTransferSequence } from "@/components/game/FinalTransferSequence";
import { IntroFlow } from "@/components/game/IntroFlow";
import { MissionCard } from "@/components/game/MissionCard";
import { NarratorText } from "@/components/game/NarratorText";
import { QuizCard } from "@/components/game/QuizCard";
import { eraDefinitions } from "@/content/eras";
import { projectConfig } from "@/config/project";
import { introTheme } from "@/config/themes";
import type { GameAction } from "@/lib/game-machine";
import type { Badge, EraScreen, GameProgress, NarratorLine } from "@/types/game";

type MissionScreenType = Extract<EraScreen, { kind: "mission" }>;

function MissionScreen({
  screen,
  onWaiting,
}: {
  screen: MissionScreenType;
  onWaiting: () => void;
}) {
  const [phase, setPhase] = useState<"mission" | "waiting">("mission");

  if (phase === "waiting") {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
        <NarratorText lines={screen.waitingLines} />
        <ChoiceButton onClick={onWaiting}>{screen.waitingCta}</ChoiceButton>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col justify-center gap-6">
      <NarratorText lines={screen.lines} />
      <MissionCard label={screen.missionLabel} lines={screen.missionLines} />
      <ChoiceButton onClick={() => setPhase("waiting")}>{screen.cta}</ChoiceButton>
    </div>
  );
}

function LinesScreen({
  lines,
  cta,
  onContinue,
}: {
  lines: NarratorLine[];
  cta: string;
  onContinue: () => void;
}) {
  const [done, setDone] = useState(false);
  return (
    <div className="flex flex-1 flex-col justify-center gap-6">
      <NarratorText lines={lines} onDone={() => setDone(true)} />
      {done ? <ChoiceButton onClick={onContinue}>{cta}</ChoiceButton> : null}
    </div>
  );
}

function RevealScreen({
  lines,
  badge,
  onContinue,
}: {
  lines: NarratorLine[];
  badge?: Badge;
  onContinue: () => void;
}) {
  const [done, setDone] = useState(false);
  return (
    <div className="flex flex-1 flex-col justify-center gap-6">
      <NarratorText lines={lines} onDone={() => setDone(true)} />
      {done && badge ? <BadgeCard badge={badge} /> : null}
      {done ? <ChoiceButton onClick={onContinue}>Continuar</ChoiceButton> : null}
    </div>
  );
}

function CompatibilityScreen({
  lines,
  flicker,
  onContinue,
}: {
  lines: NarratorLine[];
  flicker?: boolean;
  onContinue: () => void;
}) {
  const [meterDone, setMeterDone] = useState(false);
  const [linesDone, setLinesDone] = useState(false);
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8">
      <CompatibilityMeter flicker={flicker} onDone={() => setMeterDone(true)} />
      {meterDone ? <NarratorText lines={lines} onDone={() => setLinesDone(true)} /> : null}
      {linesDone ? <ChoiceButton onClick={onContinue}>Continuar</ChoiceButton> : null}
    </div>
  );
}

function EraScreenRenderer({
  screen,
  eraId,
  dispatch,
}: {
  screen: EraScreen | undefined;
  eraId: keyof typeof eraDefinitions;
  dispatch: (action: GameAction) => void;
}) {
  if (!screen) return null;

  switch (screen.kind) {
    case "titleCard":
      return (
        <EraIntro
          screen={screen}
          onContinue={() => dispatch({ type: "ERA_SCENE_ADVANCE", era: eraId })}
          onEasterEgg={(badgeId) => {
            dispatch({ type: "ADD_BADGE", badgeId });
            dispatch({ type: "ADD_EASTER_EGG", id: badgeId });
          }}
        />
      );

    case "lines":
      return (
        <LinesScreen
          lines={screen.lines}
          cta={screen.cta}
          onContinue={() => dispatch({ type: "ERA_SCENE_ADVANCE", era: eraId })}
        />
      );

    case "quiz":
      return (
        <QuizCard
          screen={screen}
          onResolved={(badgeId) => {
            if (badgeId) dispatch({ type: "ADD_BADGE", badgeId });
            dispatch({ type: "ERA_SCENE_ADVANCE", era: eraId });
          }}
        />
      );

    case "reveal":
      return (
        <RevealScreen
          lines={screen.lines}
          badge={screen.badge}
          onContinue={() => {
            if (screen.badge) dispatch({ type: "ADD_BADGE", badgeId: screen.badge.id });
            dispatch({ type: "ERA_SCENE_ADVANCE", era: eraId });
          }}
        />
      );

    case "compatibility":
      return (
        <CompatibilityScreen
          lines={screen.lines}
          flicker={screen.flickerBeforeSettle}
          onContinue={() => {
            dispatch({ type: "REVEAL_COMPATIBILITY" });
            dispatch({ type: "ERA_SCENE_ADVANCE", era: eraId });
          }}
        />
      );

    case "mission":
      return (
        <MissionScreen
          screen={screen}
          onWaiting={() => dispatch({ type: "ERA_ENTER_WAITING", era: eraId })}
        />
      );

    case "closing":
      return (
        <LinesScreen
          lines={screen.lines}
          cta={screen.cta ?? "Continuar"}
          onContinue={() => dispatch({ type: "ERA_COMPLETE", era: eraId })}
        />
      );

    case "finalTransfer":
      return (
        <FinalTransferSequence
          playerOneName={projectConfig.playerOneName}
          onReachFinal={() => dispatch({ type: "FINAL_SEQUENCE_COMPLETE" })}
        />
      );

    default:
      return null;
  }
}

export function GameScreen({
  progress,
  dispatch,
}: {
  progress: GameProgress;
  dispatch: (action: GameAction) => void;
}) {
  if (!progress.introCompleted) {
    return (
      <AppShell>
        <EraThemeProvider theme={introTheme}>
          <IntroFlow progress={progress} dispatch={dispatch} />
        </EraThemeProvider>
      </AppShell>
    );
  }

  const era = eraDefinitions[progress.currentEra];
  const status = progress.eraStatuses[progress.currentEra];
  const sceneIndex = progress.eraSceneIndex[progress.currentEra];
  const isWaiting = status === "waiting_for_event" || status === "confirming_event";

  return (
    <AppShell>
      <EraThemeProvider theme={era.theme}>
        <div className="flex flex-1 flex-col px-6 py-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${era.id}-${isWaiting ? "waiting" : sceneIndex}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="flex flex-1 flex-col"
            >
              {isWaiting && era.eventConfirmation ? (
                <EventConfirmation
                  copy={era.eventConfirmation}
                  onNotYet={() => dispatch({ type: "EVENT_NOT_YET", era: era.id })}
                  onConfirmed={() => dispatch({ type: "EVENT_CONFIRMED", era: era.id })}
                />
              ) : (
                <EraScreenRenderer
                  screen={era.screens[sceneIndex]}
                  eraId={era.id}
                  dispatch={dispatch}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </EraThemeProvider>
    </AppShell>
  );
}
