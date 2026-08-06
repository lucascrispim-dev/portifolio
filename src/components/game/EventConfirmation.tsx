"use client";

import { useState } from "react";
import { ChoiceButton } from "@/components/game/ChoiceButton";
import { NarratorText } from "@/components/game/NarratorText";
import { LoadingSequence } from "@/components/game/LoadingSequence";
import { SpontaneousNarrator } from "@/components/game/SpontaneousNarrator";
import type { EventConfirmationCopy, NarratorLine } from "@/types/game";

type Phase =
  | "reopen"
  | "question"
  | "notYet"
  | "certainty"
  | "maybe"
  | "doubt"
  | "certain"
  | "analyzing"
  | "registered";

export function EventConfirmation({
  copy,
  spontaneousSeed = 0,
  onNotYet,
  onConfirmed,
}: {
  copy: EventConfirmationCopy;
  spontaneousSeed?: number;
  onNotYet: () => void;
  onConfirmed: () => void;
}) {
  const [phase, setPhase] = useState<Phase>("reopen");

  const notYetLines: NarratorLine[] = copy.notYetResponse;

  return (
    <div className="flex flex-col gap-6">
      {phase === "reopen" ? (
        <NarratorText lines={copy.reopenLines} onDone={() => setPhase("question")} />
      ) : null}

      {phase === "question" ? (
        <div className="flex flex-col gap-5">
          <NarratorText lines={copy.reopenLines} />
          <NarratorText lines={copy.question} />
          <div className="flex flex-col gap-3">
            <ChoiceButton variant="secondary" onClick={() => setPhase("notYet")}>
              Ainda não
            </ChoiceButton>
            <ChoiceButton onClick={() => setPhase("certainty")}>Sim</ChoiceButton>
          </div>
        </div>
      ) : null}

      {phase === "notYet" ? (
        <div className="flex flex-col gap-5">
          <NarratorText lines={notYetLines} />
          <SpontaneousNarrator seed={spontaneousSeed} />
          <ChoiceButton onClick={onNotYet}>Até depois</ChoiceButton>
        </div>
      ) : null}

      {phase === "certainty" ? (
        <div className="flex flex-col gap-5">
          <p className="text-[17px] font-semibold">{copy.confirmQuestion}</p>
          <div className="flex flex-col gap-3">
            <ChoiceButton onClick={() => setPhase("certain")}>Tenho</ChoiceButton>
            <ChoiceButton variant="secondary" onClick={() => setPhase("maybe")}>
              Talvez
            </ChoiceButton>
            <ChoiceButton variant="ghost" onClick={() => setPhase("doubt")}>
              Agora fiquei em dúvida
            </ChoiceButton>
          </div>
        </div>
      ) : null}

      {phase === "maybe" ? (
        <div className="flex flex-col gap-5">
          <NarratorText lines={copy.maybeResponse} />
          <ChoiceButton onClick={onNotYet}>Até depois</ChoiceButton>
        </div>
      ) : null}

      {phase === "doubt" ? (
        <div className="flex flex-col gap-5">
          <NarratorText lines={copy.doubtResponse} />
          <ChoiceButton onClick={onNotYet}>Até depois</ChoiceButton>
        </div>
      ) : null}

      {phase === "certain" ? (
        <NarratorText
          lines={copy.certainResponse}
          onDone={() => setPhase("analyzing")}
        />
      ) : null}

      {phase === "analyzing" ? (
        <LoadingSequence
          label={copy.analyzingLabel}
          onDone={() => setPhase("registered")}
        />
      ) : null}

      {phase === "registered" ? (
        <div className="flex flex-col gap-5">
          <p className="font-mono text-sm opacity-80">
            Evento identificado:
            <br />
            {copy.eventLabel}
          </p>
          <NarratorText lines={copy.registeredLines} />
          <ChoiceButton onClick={onConfirmed}>Continuar</ChoiceButton>
        </div>
      ) : null}
    </div>
  );
}
