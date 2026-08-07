"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AppShell } from "@/components/game/AppShell";
import { AchievementCard } from "@/components/game/AchievementCard";
import { AfterYesSequence } from "@/components/game/AfterYesSequence";
import { ChoiceButton } from "@/components/game/ChoiceButton";
import { CompatibilityBar } from "@/components/game/CompatibilityBar";
import { ConfessionSequence } from "@/components/game/ConfessionSequence";
import { EraIntro } from "@/components/game/EraIntro";
import { EraMicroEggs } from "@/components/game/EraMicroEggs";
import { EraOutro } from "@/components/game/EraOutro";
import { EraThemeProvider } from "@/components/game/EraThemeProvider";
import { EraThirteenSequence } from "@/components/game/EraThirteenSequence";
import { Erro13Sequence } from "@/components/game/Erro13Sequence";
import { FakeResetFlow } from "@/components/game/FakeResetFlow";
import {
  EasterEggToast,
  useGlobalEasterEggs,
} from "@/components/game/GlobalEasterEggs";
import { IntroFlow } from "@/components/game/IntroFlow";
import { LookAtHimScreen } from "@/components/game/LookAtHimScreen";
import { MenuDrawer } from "@/components/game/MenuDrawer";
import { NarratorText } from "@/components/game/NarratorText";
import { OpenQuestion } from "@/components/game/OpenQuestion";
import { ProgressMap } from "@/components/game/ProgressMap";
import { QuizCard } from "@/components/game/QuizCard";
import { SaveAndEndScreen } from "@/components/game/SaveAndEndScreen";
import { SystemBlock } from "@/components/game/SystemBlock";
import { BathroomMaze } from "@/components/game/minigames/BathroomMaze";
import { CallItWhatYouWant } from "@/components/game/minigames/CallItWhatYouWant";
import { EnchantedStars } from "@/components/game/minigames/EnchantedStars";
import { HandToLucas } from "@/components/game/minigames/HandToLucas";
import { InvisibleString } from "@/components/game/minigames/InvisibleString";
import { NameChallenge } from "@/components/game/minigames/NameChallenge";
import { PaperRingsChaos } from "@/components/game/minigames/PaperRingsChaos";
import { PenaltyShootout } from "@/components/game/minigames/PenaltyShootout";
import { TrustScale } from "@/components/game/minigames/TrustScale";
import { WoodsLabyrinth } from "@/components/game/minigames/WoodsLabyrinth";
import { LoveStory, OurSong } from "@/components/game/minigames/WordGames";
import { eraDefinitions } from "@/content/eras";
import { introTheme } from "@/config/themes";
import { nextPatienceValue } from "@/lib/patience";
import type { GameAction } from "@/lib/game-machine";
import type {
  Achievement,
  EraScreen,
  GameProgress,
  MinigameKind,
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
  const losePatience = () =>
    dispatch({ type: "LOSE_PATIENCE", to: nextPatienceValue(progress.patience) });

  // --- Sequência final: cada etapa é irreversível, nunca volta ao jogo. ---
  if (progress.finalStage !== "playing") {
    return (
      <AppShell>
        <EraThemeProvider theme={introTheme} blackout>
          <FinalStageRenderer
            progress={progress}
            dispatch={dispatch}
            onAchievement={addAchievement}
          />
        </EraThemeProvider>
      </AppShell>
    );
  }

  // --- O falso reset cobre o jogo inteiro sem apagar nada de verdade. ---
  if (progress.fakeResetStage === "replaying") {
    return (
      <AppShell>
        <EraThemeProvider theme={introTheme} blackout>
          <FakeResetFlow
            onFinished={() => {
              dispatch({ type: "SET_FAKE_RESET_STAGE", stage: "revealed" });
              // A Era III termina aqui — o susto era o desfecho dela.
              dispatch({ type: "ERA_COMPLETE", era: 3 });
            }}
            onAchievement={addAchievement}
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

  const advance = () => dispatch({ type: "ERA_SCENE_ADVANCE", era: era.id });
  const completeEra = () => dispatch({ type: "ERA_COMPLETE", era: era.id });

  /**
   * O ERRO 13 toma a tela inteira: nenhum menu, nenhuma cor da Era. Um
   * sistema que acabou de corromper os próprios dados não continuaria
   * exibindo a interface bonitinha em volta.
   */
  if (screen?.kind === "erro13") {
    return (
      <AppShell>
        <EraThemeProvider theme={introTheme} blackout>
          <Erro13Sequence
            onRestart={() =>
              dispatch({ type: "SET_FAKE_RESET_STAGE", stage: "replaying" })
            }
          />
        </EraThemeProvider>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <EraThemeProvider theme={era.theme}>
        <div onClickCapture={registerClick} className="flex flex-1 flex-col">
          <MenuDrawer
            patience={progress.patience}
            patienceBroken={progress.fakeResetStage === "revealed"}
            onOpenCountChange={registerDeadTap}
            onLogoTap={registerLogoTap}
          />
          <EasterEggToast message={toast} />
          <EraMicroEggs
            eraId={era.id}
            foundEggs={progress.easterEggs}
            onAchievement={addAchievement}
            onEasterEgg={(id) => dispatch({ type: "ADD_EASTER_EGG", id })}
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
                  onPatienceDrop={losePatience}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </EraThemeProvider>
    </AppShell>
  );
}

/**
 * Da confissão em diante o jogo deixa de ser um jogo: nenhuma destas
 * etapas devolve o controle ao mapa, e `SET_FINAL_STAGE` recusa
 * retrocessos, então recarregar a página no meio não desfaz nada.
 */
function FinalStageRenderer({
  progress,
  dispatch,
  onAchievement,
}: {
  progress: GameProgress;
  dispatch: (action: GameAction) => void;
  onAchievement: (id: string) => void;
}) {
  switch (progress.finalStage) {
    case "confession":
      return (
        <ConfessionSequence
          onDone={() => dispatch({ type: "SET_FINAL_STAGE", stage: "eraXiii" })}
        />
      );

    case "eraXiii":
      return (
        <EraThirteenSequence
          onDone={() =>
            dispatch({ type: "SET_FINAL_STAGE", stage: "transferring" })
          }
        />
      );

    // "transferring" existe só como marco persistido: a transferência é
    // exibida no fim da Era XIII e cai direto na tela terminal.
    case "transferring":
    case "lookAtHim":
      return (
        <LookAtHimScreen
          onTrigger={() =>
            dispatch({ type: "SET_FINAL_STAGE", stage: "answered" })
          }
        />
      );

    case "answered":
      return (
        <AfterYesSequence
          onAchievement={onAchievement}
          onRestart={() => dispatch({ type: "RESET" })}
        />
      );

    default:
      return null;
  }
}

function ScreenRenderer({
  screen,
  progress,
  dispatch,
  onAdvance,
  onCompleteEra,
  onDeadTap,
  onPatienceDrop,
}: {
  screen: EraScreen | undefined;
  progress: GameProgress;
  dispatch: (action: GameAction) => void;
  onAdvance: () => void;
  onCompleteEra: () => void;
  onDeadTap: () => void;
  onPatienceDrop: () => void;
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

    case "openQuestion":
      return (
        <OpenQuestion
          screen={screen}
          onAnswer={(questionId, text) =>
            dispatch({ type: "SET_OPEN_ANSWER", questionId, text })
          }
          onContinue={onAdvance}
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
          dispatch={dispatch}
          onAchievement={addAchievement}
          onPatienceDrop={onPatienceDrop}
          onDone={onAdvance}
        />
      );

    case "progressMap":
      return (
        <ProgressMap
          eraStatuses={progress.eraStatuses}
          eraXiiiTapCount={progress.eraXiiiTapCount}
          onEraXiiiTap={() => dispatch({ type: "ERA_XIII_TAP" })}
          onAchievement={addAchievement}
          onContinue={onAdvance}
          cta={screen.cta}
        />
      );

    case "eraOutro":
      return (
        <EraOutro
          progressLabel={screen.progressLabel}
          recalculatedLabel={screen.recalculatedLabel}
          recalculatedLines={screen.recalculatedLines}
          lines={screen.lines}
          cta={screen.cta}
          onContinue={onCompleteEra}
        />
      );

    // O ERRO 13 é tratado antes daqui, em tela cheia.
    case "erro13":
      return null;

    case "saveAndEnd":
      return (
        <SaveAndEndScreen
          onEnd={() => dispatch({ type: "SET_FINAL_STAGE", stage: "confession" })}
        />
      );

    default:
      return null;
  }
}

function MinigameScreen({
  game,
  dispatch,
  onAchievement,
  onPatienceDrop,
  onDone,
}: {
  game: MinigameKind;
  dispatch: (action: GameAction) => void;
  onAchievement: (id: string) => void;
  onPatienceDrop: () => void;
  onDone: () => void;
}) {
  switch (game) {
    case "nameChallenge":
      return (
        <NameChallenge
          onAnswer={(text) =>
            dispatch({ type: "SET_OPEN_ANSWER", questionId: "nome", text })
          }
          onDone={onDone}
        />
      );
    case "trustScale":
      return <TrustScale onDone={onDone} />;
    case "ourSong":
      return <OurSong onDone={onDone} />;
    case "loveStory":
      return <LoveStory onDone={onDone} />;
    case "handToLucas":
      return (
        <HandToLucas
          onChoice={(choice) => dispatch({ type: "SET_LUCAS_CHOICE", choice })}
          onDone={onDone}
        />
      );
    case "enchantedStars":
      return (
        <EnchantedStars
          onDone={onDone}
          onAchievement={onAchievement}
          onPatienceDrop={onPatienceDrop}
        />
      );
    case "bathroomMaze":
      return (
        <BathroomMaze
          onDone={onDone}
          onAchievement={onAchievement}
          onPatienceDrop={onPatienceDrop}
        />
      );
    case "woodsLabyrinth":
      return (
        <WoodsLabyrinth
          onDone={onDone}
          onAchievement={onAchievement}
          onPatienceDrop={onPatienceDrop}
        />
      );
    case "penaltyShootout":
      return (
        <PenaltyShootout
          onDone={onDone}
          onAchievement={onAchievement}
          onPatienceDrop={onPatienceDrop}
        />
      );
    case "callItWhatYouWant":
      return <CallItWhatYouWant onDone={onDone} />;
    case "paperRings":
      return <PaperRingsChaos onDone={onDone} onAchievement={onAchievement} />;
    case "invisibleString":
      return (
        <InvisibleString
          onDone={onDone}
          onAchievement={onAchievement}
          onTheOne={() => dispatch({ type: "ADD_EASTER_EGG", id: "the-1" })}
        />
      );
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
