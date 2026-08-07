"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Central de notificações do sistema.
 *
 * Existe por dois motivos. O primeiro é de experiência: o jogo precisa
 * parecer que está sempre fazendo alguma coisa, mesmo enquanto o jogador
 * só lê — notificações que chegam sozinhas resolvem isso melhor do que
 * qualquer texto extra. O segundo é técnico: antes disso os easter eggs,
 * as mensagens de Era e os avisos do sistema tinham cada um a sua caixa
 * `fixed`, e duas mensagens simultâneas se sobrepunham na tela. Aqui
 * existe uma fila só, empilhada e com limite.
 */

export type NotificationTone = "system" | "reward" | "alert";

export type Notification = {
  id: number;
  title: string;
  body?: string;
  tone: NotificationTone;
};

export type NotificationInput = {
  title: string;
  body?: string;
  tone?: NotificationTone;
  /** Quanto tempo fica na tela. */
  durationMs?: number;
};

type NotifyFn = (input: NotificationInput) => void;

const NotificationContext = createContext<NotifyFn | null>(null);

/** Nunca mais que isto na tela ao mesmo tempo — o resto vira ruído. */
const MAX_VISIBLE = 3;
const DEFAULT_DURATION_MS = 5200;

export function useNotify(): NotifyFn {
  const notify = useContext(NotificationContext);
  if (!notify) {
    throw new Error("useNotify precisa estar dentro de NotificationProvider");
  }
  return notify;
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Notification[]>([]);
  const nextId = useRef(1);
  const timers = useRef(new Set<number>());

  useEffect(() => {
    const pending = timers.current;
    return () => {
      pending.forEach((timer) => window.clearTimeout(timer));
      pending.clear();
    };
  }, []);

  const notify = useCallback<NotifyFn>((input) => {
    const id = nextId.current;
    nextId.current += 1;

    setItems((current) => {
      const next = [
        ...current,
        { id, title: input.title, body: input.body, tone: input.tone ?? "system" },
      ];
      // A mais antiga sai para a mais nova entrar: quem acabou de tocar
      // em alguma coisa precisa ver a resposta daquele toque.
      return next.slice(-MAX_VISIBLE);
    });

    const timer = window.setTimeout(() => {
      setItems((current) => current.filter((item) => item.id !== id));
      timers.current.delete(timer);
    }, input.durationMs ?? DEFAULT_DURATION_MS);
    timers.current.add(timer);
  }, []);

  const value = useMemo(() => notify, [notify]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <NotificationStack items={items} />
    </NotificationContext.Provider>
  );
}

function NotificationStack({ items }: { items: Notification[] }) {
  const reducedMotion = useReducedMotion();

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 top-3 z-[60] flex flex-col items-center gap-2 px-4"
    >
      <AnimatePresence initial={false}>
        {items.map((item) => (
          <motion.div
            key={item.id}
            layout={!reducedMotion}
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -14, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="w-full max-w-xs rounded-xl border border-white/15 bg-black/85 px-4 py-3 text-left shadow-lg backdrop-blur-sm"
          >
            <p
              className={`font-mono text-[10px] tracking-[0.24em] ${TONE_TITLE[item.tone]}`}
            >
              {item.title}
            </p>
            {item.body ? (
              <p className="mt-1 whitespace-pre-line text-[13px] leading-relaxed text-neutral-200">
                {item.body}
              </p>
            ) : null}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/**
 * Cores fixas (não do tema da Era): a notificação é o sistema falando
 * por cima do jogo, então ela mantém a mesma cara em todas as Eras. É o
 * que a faz parecer vir "de fora".
 */
const TONE_TITLE: Record<NotificationTone, string> = {
  system: "text-neutral-400",
  reward: "text-amber-300",
  alert: "text-red-400",
};
