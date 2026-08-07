"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AppShell } from "@/components/game/AppShell";
import { AchievementCard } from "@/components/game/AchievementCard";
import { ChoiceButton } from "@/components/game/ChoiceButton";
import { CompatibilityBar } from "@/components/game/CompatibilityBar";
import { EraIntro } from "@/components/game/EraIntro";
import { EraMicroEggs } from "@/components/game/EraMicroEggs";
import { EraThemeProvider } from "@/components/game/EraThemeProvider";
import { FinalTransferSequence } from "@/components/game/FinalTransferSequence";
import {
  EasterEggToast,
  useGlobalEasterEggs,
} from "@/components/game/GlobalEasterEggs";
import { InterruptionSequence } from "@/components/game/InterruptionSequence";
import { IntroFlow } from "@/components/game/IntroFlow";
import { NarratorText } from "@/components/game/NarratorText";
import { ProgressMap } from "@/components/game/ProgressMap";
import { QuizCard } from "@/components/game/QuizCard";
import { SaveAndEndScreen } from "@/components/game/SaveAndEndScreen";
import { SoundToggle } from "@/components/game/SoundToggle";
import { SystemBlock } from "@/components/game/SystemBlock";
import { BlankSpaceInput } from "@/components/game/minigames/BlankSpaceInput";
import { FileCards } from "@/components/game/minigames/FileCards";
import { PaperRings } from "@/components/game/minigames/PaperRings";
import {
  CruelSummer,
  NoTouchButton,
} from "@/components/game/minigames/SmallInteractions";
import { StarCursor } from "@/components/game/minigames/StarCursor";
import { TrustScale } from "@/components/game/minigames/TrustScale";
import { WaterCup } from "@/components/game/minigames/WaterCup";
import { WordSearch } from "@/components/game/minigames/WordSearch";
import { eraDefinitions } from "@/content/eras";
import { introTheme } from "@/config/themes";
import type { GameAction } from "@/lib/game-machine";
import type {
  Achievement,
  EraScreen,
  GameProgress,
  NarratorLine,
} from "@/types/game";

export function GameScreen({
  progress,
  dispatch,
}: {
  progress: GameProgress;
  dispatch: (action: GameAction) => void;
}) {
  const { toast, registerLogoTap, registerClick, registerDeadTap } =
    useGlobalEasterEggs({
      achievements: progress.achievements,
      easterEggs: progress.easterEggs,
      onEgg: (event) => {
        dispatch({ type: "ADD_EASTER_EGG", id: event.easterEggId });
        if (event.achievementId) {
          dispatch({ type: "ADD_ACHIEVEMENT", achievementId: event.achievementId });
        }
      },
    });

  const addAchievement = (id: string) =>
    dispatch({ type: "ADD_ACHIEVEMENT", achievementId: id });
  const addEasterEgg = (id: string) => dispatch({ type: "ADD_EASTER_EGG", id });

  // --- Sequência final: irreversível, sem volta para o jogo. ---
  if (progress.finalStage === "interrupted") {
    return (
      <AppShell>
        <EraThemeProvider theme={introTheme} blackout>
          <InterruptionSequence
            onDone={() => dispatch({ type: "SET_FINAL_STAGE", stage: "transferring" })}
          />
        </EraThemeProvider>
      </AppShell>
    );
  }

  if (progress.finalStage === "transferring" || progress.finalStage === "final") {
    return (
      <AppShell>
        <EraThemeProvider theme={introTheme} blackout>
          <FinalTransferSequence
            onReachFinal={() => dispatch({ type: "SET_FINAL_STAGE", stage: "final" })}
          />
        </EraThemeProvider>
      </AppShell>
    );
  }

  if (!progress.introCompleted) {
    return (
      <AppShell>
        <EraThemeProvider theme={introTheme}>
          <EasterEggToast message={toast} />
          <IntroFlow progress={progress} dispatch={dispatch} />
        </EraThemeProvider>
      </AppShell>
    );
  }

  const era = eraDefinitions[progress.currentEra];
  const sceneIndex = progress.eraSceneIndex[progress.currentEra];
  const screen = era.screens[sceneIndex];

  const advance = () =>
    dispatch({ type: "ERA_SCENE_ADVANCE", era: era.id });
  const completeEra = () => dispatch({ type: "ERA_COMPLETE", era: era.id });

  return (
    <AppShell>
      <EraThemeProvider theme={era.theme}>
        <div onClickCapture={registerClick} className="flex flex-1 flex-col">
          <TopBar onLogoTap={registerLogoTap} />
          <EasterEggToast message={toast} />
          <EraMicroEggs
            eraId={era.id}
            foundEggs={progress.easterEggs}
            onAchievement={(id) => addAchievement(id)}
            onEasterEgg={addEasterEgg}
          />

          <div className="flex flex-1 flex-col px-6 pb-10 pt-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${era.id}-${sceneIndex}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-1 flex-col"
              >
                <ScreenRenderer
                  screen={screen}
                  progress={progress}
                  dispatch={dispatch}
                  onAdvance={advance}
                  onCompleteEra={completeEra}
                  onDeadTap={registerDeadTap}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </EraThemeProvider>
    </AppShell>
  );
}

/** O logotipo é o alvo do easter egg dos treze toques. */
function TopBar({ onLogoTap }: { onLogoTap: () => void }) {
  return (
    <div className="flex items-center justify-between px-4 pt-2">
      <button
        type="button"
        onClick={onLogoTap}
        aria-label="PROJECT: NEXT ERA"
        className="min-h-11 font-mono text-[10px] tracking-[0.3em] opacity-40 focus-visible:outline focus-visible:outline-2"
      >
        P:NE
      </button>
      <SoundToggle />
    </div>
  );
}

function ScreenRenderer({
  screen,
  progress,
  dispatch,
  onAdvance,
  onCompleteEra,
  onDeadTap,
}: {
  screen: EraScreen | undefined;
  progress: GameProgress;
  dispatch: (action: GameAction) => void;
  onAdvance: () => void;
  onCompleteEra: () => void;
  onDeadTap: () => void;
}) {
  if (!screen) return null;

  const addAchievement = (id: string) =>
    dispatch({ type: "ADD_ACHIEVEMENT", achievementId: id });

  switch (screen.kind) {
    case "titleCard":
      return <EraIntro screen={screen} onContinue={onAdvance} onDeadTap={onDeadTap} />;

    case "lines":
      return <LinesScreen lines={screen.lines} cta={screen.cta} onContinue={onAdvance} />;

    case "quiz":
      return (
        <QuizCard
          screen={screen}
          onResolved={(achievementId) => {
            if (achievementId) addAchievement(achievementId);
            onAdvance();
          }}
        />
      );

    case "reveal":
      return (
        <RevealScreen
          systemBlock={screen.systemBlock}
          lines={screen.lines}
          achievement={screen.achievement}
          cta={screen.cta ?? "CONTINUAR"}
          onAchievement={addAchievement}
          onContinue={onAdvance}
        />
      );

    case "compatibility":
      return (
        <CompatibilityScreen
          label={screen.label}
          lines={screen.lines}
          theOneEasterEgg={screen.theOneEasterEgg}
          footerBlock={screen.footerBlock}
          onTheOneFound={() => dispatch({ type: "ADD_EASTER_EGG", id: "the-1" })}
          onContinue={onAdvance}
        />
      );

    case "minigame":
      return (
        <MinigameScreen
          game={screen.game}
          progress={progress}
          dispatch={dispatch}
          onAchievement={addAchievement}
          onDone={onAdvance}
        />
      );

    case "progressMap":
      return (
        <ProgressMap
          eraStatuses={progress.eraStatuses}
          eraXiiiTapCount={progress.eraXiiiTapCount}
          onEraXiiiTap={() => dispatch({ type: "ERA_XIII_TAP" })}
          onContinue={onAdvance}
          cta={screen.cta}
        />
      );

    case "eraOutro":
      return (
        <EraOutro
          progressLabel={screen.progressLabel}
          lines={screen.lines}
          cta={screen.cta}
          onContinue={onCompleteEra}
        />
      );

    case "saveAndEnd":
      return (
        <SaveAndEndScreen
          onEnd={() => dispatch({ type: "SET_FINAL_STAGE", stage: "interrupted" })}
        />
      );

    default:
      return null;
  }
}

function MinigameScreen({
  game,
  progress,
  dispatch,
  onAchievement,
  onDone,
}: {
  game: Extract<EraScreen, { kind: "minigame" }>["game"];
  progress: GameProgress;
  dispatch: (action: GameAction) => void;
  onAchievement: (id: string) => void;
  onDone: () => void;
}) {
  switch (game) {
    case "wordSearch":
      return <WordSearch onDone={onDone} />;
    case "starCursor":
      return <StarCursor onDone={onDone} onAchievement={onAchievement} />;
    case "blankSpace":
      return (
        <BlankSpaceInput
          onSubmit={(text) => dispatch({ type: "SET_BLANK_SPACE", text })}
          onDone={onDone}
        />
      );
    case "waterCup":
      return <WaterCup onDone={onDone} onAchievement={onAchievement} />;
    case "paperRings":
      return <PaperRings onDone={onDone} onAchievement={onAchievement} />;
    case "fileCards":
      return (
        <FileCards blankSpaceAnswer={progress.blankSpaceAnswer} onDone={onDone} />
      );
    case "cruelSummer":
      return <CruelSummer onDone={onDone} />;
    case "noTouchButton":
      return <NoTouchButton onDone={onDone} onAchievement={onAchievement} />;
    case "trustScale":
      return <TrustScale onDone={onDone} />;
    default:
      return null;
  }
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
  systemBlock,
  lines,
  achievement,
  cta,
  onAchievement,
  onContinue,
}: {
  systemBlock?: string[];
  lines: NarratorLine[];
  achievement?: Achievement;
  cta: string;
  onAchievement: (id: string) => void;
  onContinue: () => void;
}) {
  const [done, setDone] = useState(lines.length === 0);
  return (
    <div className="flex flex-1 flex-col justify-center gap-6">
      {systemBlock ? <SystemBlock lines={systemBlock} /> : null}
      {lines.length > 0 ? (
        <NarratorText lines={lines} onDone={() => setDone(true)} />
      ) : null}
      {done && achievement ? (
        <AchievementCard achievement={achievement} onUnlock={onAchievement} />
      ) : null}
      {done ? <ChoiceButton onClick={onContinue}>{cta}</ChoiceButton> : null}
    </div>
  );
}

function CompatibilityScreen({
  label,
  lines,
  theOneEasterEgg,
  footerBlock,
  onTheOneFound,
  onContinue,
}: {
  label?: string;
  lines: NarratorLine[];
  theOneEasterEgg?: boolean;
  footerBlock?: string[];
  onTheOneFound: () => void;
  onContinue: () => void;
}) {
  const [barDone, setBarDone] = useState(false);
  const [linesDone, setLinesDone] = useState(false);
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-7">
      <CompatibilityBar
        label={label}
        theOneEasterEgg={theOneEasterEgg}
        onTheOneFound={onTheOneFound}
        onDone={() => setBarDone(true)}
      />
      {barDone && footerBlock ? <SystemBlock lines={footerBlock} /> : null}
      {barDone ? (
        <NarratorText lines={lines} onDone={() => setLinesDone(true)} />
      ) : null}
      {linesDone ? (
        <ChoiceButton onClick={onContinue}>CONTINUAR</ChoiceButton>
      ) : null}
    </div>
  );
}

function EraOutro({
  progressLabel,
  lines,
  cta,
  onContinue,
}: {
  progressLabel: string;
  lines: NarratorLine[];
  cta: string;
  onContinue: () => void;
}) {
  const [done, setDone] = useState(false);
  return (
    <div className="flex flex-1 flex-col justify-center gap-6">
      <SystemBlock lines={["Progresso:", progressLabel]} />
      <NarratorText lines={lines} onDone={() => setDone(true)} />
      {done ? <ChoiceButton onClick={onContinue}>{cta}</ChoiceButton> : null}
    </div>
  );
}
