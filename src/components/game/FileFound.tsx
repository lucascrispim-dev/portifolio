"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChoiceButton } from "@/components/game/ChoiceButton";
import { NarratorText } from "@/components/game/NarratorText";
import { SystemBlock } from "@/components/game/SystemBlock";
import { useEraTheme } from "@/components/game/EraThemeProvider";
import { useNotify } from "@/components/game/SystemNotifications";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { getSecretFile } from "@/content/secret-files";
import { playEffect } from "@/lib/audio";

/**
 * Um arquivo secreto localizado.
 *
 * O conteúdo é sempre uma anotação interna do próprio sistema sobre o
 * jogador ou sobre o Lucas — nunca informação útil ao jogo. O prazer
 * aqui é o de ler o que não era para ler, e descobrir que o sistema
 * estava tomando notas com opinião esse tempo todo.
 *
 * Depois de aberto, o arquivo fica listado no menu para sempre.
 */
export function FileFound({
  fileId,
  onUnlock,
  onContinue,
  cta = "FECHAR ARQUIVO",
}: {
  fileId: string;
  onUnlock: (fileId: string) => void;
  onContinue: () => void;
  cta?: string;
}) {
  const theme = useEraTheme();
  const reducedMotion = useReducedMotion();
  const notify = useNotify();
  const file = getSecretFile(fileId);
  const [commentDone, setCommentDone] = useState(false);

  useEffect(() => {
    if (!file) return;
    playEffect("confirm");
    onUnlock(file.id);
    notify({
      title: "ARQUIVO LOCALIZADO",
      body: `${file.code} — ${file.name}`,
      tone: "reward",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileId]);

  if (!file) return null;

  const hasComment = Boolean(file.comment?.length);

  return (
    <div className="flex flex-1 flex-col justify-center gap-6">
      <div className="flex flex-col gap-1">
        <p className="font-mono text-[10px] tracking-[0.3em] opacity-60">
          ARQUIVO LOCALIZADO
        </p>
        <p
          className="font-mono text-sm tracking-[0.14em]"
          style={{ color: theme.accent }}
        >
          {file.code} — {file.name}
        </p>
      </div>

      <motion.div
        initial={reducedMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="border p-4"
        style={{
          borderColor: `${theme.foreground}2e`,
          borderRadius: theme.radius,
          backgroundColor: `${theme.foreground}0a`,
        }}
      >
        <SystemBlock lines={file.body} />
      </motion.div>

      {hasComment ? (
        <NarratorText
          lines={file.comment ?? []}
          onDone={() => setCommentDone(true)}
        />
      ) : null}

      {!hasComment || commentDone ? (
        <ChoiceButton onClick={onContinue}>{cta}</ChoiceButton>
      ) : null}
    </div>
  );
}
