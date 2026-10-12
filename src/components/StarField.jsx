import { useEffect, useState } from 'react';

// Generate stable star positions
const STARS = Array.from({ length: 60 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 2 + 0.5,
  duration: Math.random() * 4 + 2,
  delay: Math.random() * 4,
}));

export default function StarField() {
  return (
    <div className="stars" aria-hidden="true">
      {STARS.map(star => (
        <div
          key={star.id}
          className="star"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDuration: `${star.duration}s`,
            animationDelay: `${star.delay}s`,
            opacity: Math.random() * 0.6 + 0.1,
          }}
        />
      ))}
    </div>
  );
}
