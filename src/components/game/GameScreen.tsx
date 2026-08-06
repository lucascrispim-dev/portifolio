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
import { SoundToggle } from "@/components/game/SoundToggle";
import { StandbyScreen } from "@/components/game/StandbyScreen";
import { eraDefinitions } from "@/content/eras";
import { projectConfig } from "@/config/project";
import { introTheme } from "@/config/themes";
import { useReopenSignal } from "@/hooks/useReopenSignal";
import type { GameAction } from "@/lib/game-machine";
import type {
  Badge,
  EraId,
  EraScreen,
  GameProgress,
  NarratorLine,
} from "@/types/game";

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
  onEnterWaiting,
}: {
  screen: EraScreen | undefined;
  eraId: EraId;
  dispatch: (action: GameAction) => void;
  onEnterWaiting: () => void;
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
      return <MissionScreen screen={screen} onWaiting={onEnterWaiting} />;

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

/** Sentinela: standby encerrado manualmente, nunca igual a um reopenCount real. */
const STANDBY_DISMISSED = -1;

export function GameScreen({
  progress,
  dispatch,
}: {
  progress: GameProgress;
  dispatch: (action: GameAction) => void;
}) {
  const reopenCount = useReopenSignal();
  /**
   * Para cada Era, em qual "reabertura" ela entrou em espera. Estado de
   * sessão — deliberadamente NÃO persistido: recarregar a página é
   * justamente o que caracteriza uma reabertura, então uma sessão nova
   * começa vazia e cai direto na confirmação do acontecimento.
   */
  const [standbyEnteredAt, setStandbyEnteredAt] = useState<
    Partial<Record<EraId, number>>
  >({});

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

  /**
   * Standby só enquanto a Era entrou em espera nesta mesma "reabertura".
   * Quando `reopenCount` avança (jogador guardou o celular e voltou), a
   * comparação deixa de bater e a confirmação assume — sem efeito nenhum,
   * é derivação pura.
   */
  const isStandby = isWaiting && standbyEnteredAt[era.id] === reopenCount;

  /**
   * Na sequência final da Era VIII não pode existir nenhum controle na
   * tela — nem o de som. "Não existe botão. Não existe opção." (roteiro
   * Era VIII, tela final).
   */
  const isFinalSequence =
    !isWaiting && era.screens[sceneIndex]?.kind === "finalTransfer";

  function enterWaiting(eraId: EraId) {
    setStandbyEnteredAt((previous) => ({ ...previous, [eraId]: reopenCount }));
    dispatch({ type: "ERA_ENTER_WAITING", era: eraId });
  }

  function dismissStandby(eraId: EraId) {
    setStandbyEnteredAt((previous) => ({
      ...previous,
      [eraId]: STANDBY_DISMISSED,
    }));
  }

  return (
    <AppShell>
      <EraThemeProvider theme={era.theme} blackout={isFinalSequence}>
        {isFinalSequence ? null : <SoundToggle />}
        {/* A sequência final é preta de ponta a ponta — sem respiro do tema da Era. */}
        <div
          className={`flex flex-1 flex-col ${isFinalSequence ? "bg-black" : "px-6 py-10"}`}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={`${era.id}-${isStandby ? "standby" : isWaiting ? "waiting" : sceneIndex}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="flex flex-1 flex-col"
            >
              {isStandby ? (
                <StandbyScreen
                  returnCount={reopenCount + era.id}
                  onReturn={() => dismissStandby(era.id)}
                />
              ) : isWaiting && era.eventConfirmation ? (
                <EventConfirmation
                  copy={era.eventConfirmation}
                  spontaneousSeed={reopenCount + era.id}
                  onNotYet={() => {
                    dispatch({ type: "EVENT_NOT_YET", era: era.id });
                    enterWaiting(era.id);
                  }}
                  onConfirmed={() => dispatch({ type: "EVENT_CONFIRMED", era: era.id })}
                />
              ) : (
                <EraScreenRenderer
                  screen={era.screens[sceneIndex]}
                  eraId={era.id}
                  dispatch={dispatch}
                  onEnterWaiting={() => enterWaiting(era.id)}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </EraThemeProvider>
    </AppShell>
  );
}
