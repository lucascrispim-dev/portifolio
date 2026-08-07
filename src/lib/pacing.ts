/**
 * Ritmo das sequências que o jogador não controla (a confissão, a Era XIII,
 * a continuação depois do "sim").
 *
 * `prefers-reduced-motion` pede menos movimento, não menos tempo de
 * leitura. Sem um piso, essas telas passavam em cerca de dois segundos
 * para quem tem a preferência ligada — a pessoa perdia exatamente a parte
 * que importa, e não há botão para voltar. Aqui o tempo encolhe, mas
 * nunca abaixo do que dá para ler.
 */
export const REDUCED_MOTION_FLOOR_MS = 900;

/** Beat narrativo: uma fala, um cartão, uma virada de tela. */
export function pace(ms: number, reducedMotion: boolean): number {
  if (!reducedMotion) return ms;
  return Math.max(REDUCED_MOTION_FLOOR_MS, Math.round(ms * 0.5));
}

/**
 * Passo de contador (barra subindo, percentual mudando). Continua curto
 * sob movimento reduzido: são muitos passos seguidos e o conteúdo de cada
 * um é um número, não uma frase.
 */
export function tick(ms: number, reducedMotion: boolean): number {
  return reducedMotion ? Math.max(80, Math.round(ms * 0.4)) : ms;
}
