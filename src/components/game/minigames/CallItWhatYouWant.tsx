"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChoiceButton } from "@/components/game/ChoiceButton";
import { NarratorText } from "@/components/game/NarratorText";
import { useEraTheme } from "@/components/game/EraThemeProvider";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Era VI — a única batida verdadeiramente emocional antes do final. Ela
 * levanta a pergunta ("o que vocês são?") e **não** responde: fica no
 * humor de novo, deixando o jogador achar que isso se resolve na Era XIII.
 */
export function CallItWhatYouWant({ onDone }: { onDone: () => void }) {
  const theme = useEraTheme();
  const reducedMotion = useReducedMotion();
  const [done, setDone] = useState(false);

  return (
    <div className="flex flex-1 flex-col justify-center gap-7">
      <motion.p
        initial={reducedMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="text-center font-mono text-sm tracking-[0.25em]"
        style={{ color: theme.accent }}
      >
        CALL IT WHAT YOU WANT
      </motion.p>

      <NarratorText
        lines={[
          {
            text: "Eu passei várias Eras\ntentando classificar vocês.",
            pause: "long",
          },
          { text: "Amigos?", pause: "short" },
          { text: "Ficantes?", pause: "short" },
          { text: "Dois idiotas\nandando por São Paulo?", pause: "long" },
          {
            text: "Talvez nenhum desses nomes\nexplique direito.",
            pause: "long",
          },
          { text: "Então...", pause: "short" },
          { text: "Call It What You Want.", pause: "long" },
        ]}
        onDone={() => setDone(true)}
      />

      {done ? <ChoiceButton onClick={onDone}>CONTINUAR</ChoiceButton> : null}
    </div>
  );
}
