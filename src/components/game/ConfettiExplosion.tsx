"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const COLORS = ["#F4E7C5", "#E4574C", "#A8BFA0", "#88BBD8", "#EFA8C7", "#FFFFFF"];
const PARTICLE_COUNT = 18;

type Particle = {
  id: number;
  color: string;
  dx: number;
  dy: number;
  rotate: number;
  delay: number;
};

function createParticles(): Particle[] {
  return Array.from({ length: PARTICLE_COUNT }, (_, i) => {
    const angle = (i / PARTICLE_COUNT) * Math.PI * 2;
    const distance = 60 + Math.random() * 60;
    return {
      id: i,
      color: COLORS[i % COLORS.length],
      dx: Math.cos(angle) * distance,
      dy: Math.sin(angle) * distance,
      rotate: Math.random() * 360,
      delay: Math.random() * 0.05,
    };
  });
}

type ConfettiExplosionProps = {
  originXPercent: number;
  originYPercent: number;
  onComplete?: () => void;
};

/**
 * Explosão de confetes localizada — usada na 8ª tentativa do botão "Não".
 * Ocupa apenas a vizinhança do ponto de origem, não a tela inteira.
 */
export function ConfettiExplosion({
  originXPercent,
  originYPercent,
  onComplete,
}: ConfettiExplosionProps) {
  const reducedMotion = useReducedMotion();
  const [particles] = useState(createParticles);

  useEffect(() => {
    if (reducedMotion) onComplete?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion]);

  if (reducedMotion) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute z-50"
      style={{ left: `${originXPercent}%`, top: `${originYPercent}%` }}
    >
      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className="absolute h-2 w-2 rounded-sm"
          style={{ backgroundColor: particle.color }}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
          animate={{
            x: particle.dx,
            y: particle.dy,
            opacity: 0,
            rotate: particle.rotate,
          }}
          transition={{ duration: 0.7, delay: particle.delay, ease: "easeOut" }}
          onAnimationComplete={particle.id === 0 ? onComplete : undefined}
        />
      ))}
    </div>
  );
}
