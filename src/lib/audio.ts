/**
 * Efeitos sonoros opcionais, sintetizados na hora com a Web Audio API.
 *
 * Nada é carregado da rede e nenhum arquivo é distribuído — os sons são
 * osciladores curtos gerados em tempo de execução, portanto livres de
 * direitos autorais por construção (o roteiro proíbe áudio protegido).
 *
 * Regras: o som começa **desligado**, nunca toca automaticamente (o
 * AudioContext só é criado depois de uma interação do jogador, como o
 * navegador exige), e a experiência funciona integralmente sem ele.
 */

const STORAGE_KEY = "project-next-era-sound";

export type SoundEffect = "tap" | "escape" | "confirm" | "badge";

type EffectSpec = {
  frequency: number;
  endFrequency?: number;
  durationMs: number;
  gain: number;
  type: OscillatorType;
};

const EFFECTS: Record<SoundEffect, EffectSpec> = {
  tap: { frequency: 420, durationMs: 70, gain: 0.05, type: "sine" },
  escape: { frequency: 300, endFrequency: 180, durationMs: 130, gain: 0.05, type: "triangle" },
  confirm: { frequency: 520, endFrequency: 780, durationMs: 200, gain: 0.05, type: "sine" },
  badge: { frequency: 660, endFrequency: 990, durationMs: 320, gain: 0.06, type: "sine" },
};

function readStoredPreference(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "on";
  } catch {
    return false;
  }
}

let audioContext: AudioContext | null = null;
/** Ausência de valor salvo significa "desligado" — o som nunca começa ligado. */
let enabled = typeof window !== "undefined" ? readStoredPreference() : false;

const listeners = new Set<() => void>();

/** API de store externo para `useSyncExternalStore` (ver SoundToggle). */
export function subscribeSound(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getSoundSnapshot(): boolean {
  return enabled;
}

/** No servidor o som é sempre "desligado", então a hidratação é estável. */
export function getSoundServerSnapshot(): boolean {
  return false;
}

type AudioWindow = Window & {
  webkitAudioContext?: typeof AudioContext;
};

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (audioContext) return audioContext;

  const Ctor =
    window.AudioContext ?? (window as AudioWindow).webkitAudioContext ?? null;
  if (!Ctor) return null;

  try {
    audioContext = new Ctor();
    return audioContext;
  } catch {
    return null;
  }
}

export function isSoundEnabled(): boolean {
  return enabled;
}

export function setSoundEnabled(next: boolean): void {
  enabled = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, next ? "on" : "off");
  } catch {
    // armazenamento indisponível — a preferência só não sobrevive ao reload
  }
  if (next) {
    // Criado aqui porque este caminho só roda a partir de um clique real.
    void getAudioContext()?.resume();
  }
  listeners.forEach((listener) => listener());
}

export function playEffect(effect: SoundEffect): void {
  if (!enabled) return;

  const context = getAudioContext();
  if (!context) return;

  const spec = EFFECTS[effect];
  const now = context.currentTime;
  const duration = spec.durationMs / 1000;

  const oscillator = context.createOscillator();
  const gainNode = context.createGain();

  oscillator.type = spec.type;
  oscillator.frequency.setValueAtTime(spec.frequency, now);
  if (spec.endFrequency !== undefined) {
    oscillator.frequency.exponentialRampToValueAtTime(spec.endFrequency, now + duration);
  }

  // Envelope curto para não estalar no início nem cortar seco no fim.
  gainNode.gain.setValueAtTime(0.0001, now);
  gainNode.gain.exponentialRampToValueAtTime(spec.gain, now + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  oscillator.connect(gainNode);
  gainNode.connect(context.destination);
  oscillator.start(now);
  oscillator.stop(now + duration);
}
