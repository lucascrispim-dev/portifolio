"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { motion } from "framer-motion";
import { useNotify } from "@/components/game/SystemNotifications";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import {
  DEFAULT_TYPE_SPEED_MS,
  eraPersonalities,
  type EraPersonality,
} from "@/config/personalities";
import type { PlayableEraId } from "@/types/game";

/**
 * Aplica a personalidade da Era atual.
 *
 * Três coisas acontecem aqui, e as três existem para o mesmo fim: fazer
 * a Era V parecer um software diferente da Era II, não a mesma tela
 * pintada de azul.
 *
 * 1. **Ritmo.** A velocidade de digitação vira contexto, então todo
 *    `TypewriterText` da Era herda o temperamento dela sem precisar
 *    receber prop nenhuma.
 * 2. **Anúncio.** Ao entrar na Era, o sistema declara em que modo está
 *    operando agora ("Modo aventura ativado.", "Reduzindo o ruído.").
 * 3. **Vida própria.** As notificações ambientes chegam sozinhas,
 *    enquanto o jogador lê. É o que sustenta a sensação de que o projeto
 *    está sempre fazendo alguma coisa nos bastidores.
 *
 * A Era IV ganha ainda um tremor periódico — ela é a Era instável, e
 * dizer isso é menos convincente do que a tela se mexer sozinha.
 */

const TypeSpeedContext = createContext<number>(DEFAULT_TYPE_SPEED_MS);

/** Velocidade de digitação da Era atual, em ms por caractere. */
export function useTypeSpeed(): number {
  return useContext(TypeSpeedContext);
}

export function EraPersonalityProvider({
  eraId,
  children,
}: {
  eraId: PlayableEraId;
  children: ReactNode;
}) {
  const personality = eraPersonalities[eraId];

  return (
    <TypeSpeedContext.Provider value={personality.typeSpeedMs}>
      <EraAmbience eraId={eraId} personality={personality}>
        {children}
      </EraAmbience>
    </TypeSpeedContext.Provider>
  );
}

function EraAmbience({
  eraId,
  personality,
  children,
}: {
  eraId: PlayableEraId;
  personality: EraPersonality;
  children: ReactNode;
}) {
  const notify = useNotify();
  const reducedMotion = useReducedMotion();
  const [glitching, setGlitching] = useState(false);

  /**
   * O anúncio de entrada e os eventos ambientes são agendados por Era.
   * Trocar de Era limpa todos os timers: uma notificação da Era II
   * chegando no meio da Era IV destruiria o efeito de estar em outro
   * lugar.
   */
  useEffect(() => {
    const timers: number[] = [];

    timers.push(
      window.setTimeout(
        () => notify({ title: personality.systemLabel, body: personality.bootLine }),
        900
      )
    );

    personality.ambient.forEach((event) => {
      timers.push(
        window.setTimeout(
          () => notify({ title: event.title, body: event.body }),
          event.delayMs
        )
      );
    });

    return () => timers.forEach((timer) => window.clearTimeout(timer));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eraId]);

  /** Era IV: instabilidade visível, em intervalos irregulares. */
  useEffect(() => {
    if (personality.typing !== "glitchy" || reducedMotion) return;

    let timer = 0;
    function schedule(delay: number) {
      timer = window.setTimeout(() => {
        setGlitching(true);
        window.setTimeout(() => setGlitching(false), 220);
        schedule(9000 + Math.random() * 11000);
      }, delay);
    }
    schedule(6000);

    return () => window.clearTimeout(timer);
  }, [personality.typing, reducedMotion]);

  return (
    <motion.div
      className="flex flex-1 flex-col"
      animate={
        glitching
          ? { x: [0, -3, 4, -2, 0], skewX: [0, -1.2, 0.8, 0], filter: ["none", "invert(0.06)", "none"] }
          : { x: 0, skewX: 0 }
      }
      transition={{ duration: 0.22, ease: "linear" }}
    >
      {children}
    </motion.div>
  );
}
