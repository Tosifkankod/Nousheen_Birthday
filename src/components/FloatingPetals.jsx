import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const EMOJIS = ['❤️', '🌹', '✨', '💕', '🌸', '💫', '🥀'];

export default function FloatingPetals({ count = 20 }) {
  const petals = Array.from({ length: count }, (_, i) => ({
    id: i,
    emoji: EMOJIS[i % EMOJIS.length],
    left: Math.random() * 100,
    delay: Math.random() * 8,
    duration: Math.random() * 6 + 6,
    size: Math.random() * 0.6 + 0.7,
  }));

  return (
    <div className="petals-container" aria-hidden="true">
      {petals.map(petal => (
        <div
          key={petal.id}
          className="petal"
          style={{
            left: `${petal.left}%`,
            animationDuration: `${petal.duration}s`,
            animationDelay: `${petal.delay}s`,
            fontSize: `${petal.size}rem`,
          }}
        >
          {petal.emoji}
        </div>
      ))}
    </div>
  );
}
