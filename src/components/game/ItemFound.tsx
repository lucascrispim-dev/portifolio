"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChoiceButton } from "@/components/game/ChoiceButton";
import { InventoryGlyph } from "@/components/game/InventoryGlyph";
import { NarratorText } from "@/components/game/NarratorText";
import { useEraTheme } from "@/components/game/EraThemeProvider";
import { useNotify } from "@/components/game/SystemNotifications";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { getInventoryItem } from "@/content/inventory";
import { playEffect } from "@/lib/audio";

/**
 * A entrega de um item.
 *
 * A tela é apresentada com toda a pompa de um jogo que tem sistema de
 * loot — moldura, nome em caixa alta, laudo técnico — para um objeto que
 * não faz absolutamente nada. Essa distância entre a cerimônia e a
 * inutilidade é a piada inteira, e ela só funciona se a cerimônia for
 * levada a sério: nada aqui pisca "isto é uma brincadeira".
 *
 * O sistema nunca diz para que o item serve. Nem aqui, nem no menu. Só
 * na última tela do jogo.
 */
export function ItemFound({
  itemId,
  onCollect,
  onContinue,
  cta = "GUARDAR",
}: {
  itemId: string;
  onCollect: (itemId: string) => void;
  onContinue: () => void;
  cta?: string;
}) {
  const theme = useEraTheme();
  const reducedMotion = useReducedMotion();
  const notify = useNotify();
  const item = getInventoryItem(itemId);
  const [lineDone, setLineDone] = useState(false);

  useEffect(() => {
    if (!item) return;
    playEffect("badge");
    onCollect(item.id);
    notify({ title: "ITEM ADQUIRIDO", body: item.name, tone: "reward" });
    // Só na montagem: reagir a `notify`/`onCollect` re-entregaria o item.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemId]);

  if (!item) return null;

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
      <p className="font-mono text-[10px] tracking-[0.3em] opacity-60">
        ITEM ADQUIRIDO
      </p>

      <motion.div
        initial={reducedMotion ? false : { scale: 0.8, opacity: 0, rotate: -6 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 16 }}
        className="flex h-28 w-28 items-center justify-center border"
        style={{
          borderColor: `${theme.accent}88`,
          borderRadius: theme.radius,
          backgroundColor: `${theme.foreground}0f`,
          color: theme.accent,
        }}
      >
        <InventoryGlyph kind={item.glyph} size={56} />
      </motion.div>

      <div className="flex flex-col gap-1.5">
        <p
          className="font-mono text-sm tracking-[0.14em]"
          style={{ color: theme.foreground }}
        >
          {item.name}
        </p>
        <p className="max-w-xs text-[13px] leading-relaxed opacity-65">
          {item.note}
        </p>
      </div>

      <NarratorText
        lines={[{ text: item.foundLine, pause: "short" }]}
        onDone={() => setLineDone(true)}
        className="flex flex-col gap-3"
        lineClassName="max-w-xs whitespace-pre-line text-[16px] leading-relaxed"
      />

      {lineDone ? (
        <div className="w-full max-w-xs">
          <ChoiceButton onClick={onContinue}>{cta}</ChoiceButton>
        </div>
      ) : null}
    </div>
  );
}
