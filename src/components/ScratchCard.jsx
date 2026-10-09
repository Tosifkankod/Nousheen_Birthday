import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

/**
 * Reusable ScratchCard Component
 * - Renders a textured matte black scratch-off canvas over any children (photo or video)
 * - Supports touch (mobile) and mouse (desktop) with high-DPI scaling
 * - Feathered circular brush for a natural scratch feel
 * - Auto-dissolves when threshold (e.g. 30%) is reached
 */
export default function ScratchCard({
  children,
  onRevealed,
  autoRevealThreshold = 30,
  watermark = '✦ Scratch with your finger to reveal ✦',
  className = '',
  style = {},
  aspectRatio = '4 / 5',
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef(null);

  const [isRevealed, setIsRevealed] = useState(false);
  const [scratchPercent, setScratchPercent] = useState(0);

  // Initialize canvas with matte black paper & golden speckles
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || isRevealed) return;

    const width = container.offsetWidth;
    const height = container.offsetHeight;
    if (width === 0 || height === 0) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    // Matte dark charcoal base
    ctx.fillStyle = '#0f0d0c';
    ctx.fillRect(0, 0, width, height);

    // Paper grain & subtle texture
    ctx.fillStyle = 'rgba(30, 22, 18, 0.45)';
    for (let i = 0; i < 450; i++) {
      const rx = Math.random() * width;
      const ry = Math.random() * height;
      const rsize = Math.random() * 2.5 + 0.8;
      ctx.fillRect(rx, ry, rsize, rsize);
    }

    // Golden dust specks
    ctx.fillStyle = 'rgba(232, 195, 125, 0.35)';
    for (let i = 0; i < 60; i++) {
      const gx = Math.random() * width;
      const gy = Math.random() * height;
      ctx.beginPath();
      ctx.arc(gx, gy, Math.random() * 1.5 + 0.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Delicate golden border frame
    ctx.strokeStyle = 'rgba(232, 195, 125, 0.25)';
    ctx.lineWidth = 1;
    ctx.strokeRect(10, 10, width - 20, height - 20);

    // Watermark text in center
    if (watermark) {
      ctx.font = '500 13px "Inter", -apple-system, sans-serif';
      ctx.fillStyle = 'rgba(245, 240, 235, 0.45)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(watermark, width / 2, height / 2);
    }
  }, [isRevealed, watermark]);

  useEffect(() => {
    const timer = setTimeout(initCanvas, 80);
    window.addEventListener('resize', initCanvas);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', initCanvas);
    };
  }, [initCanvas]);

  // Scratch line between two points for continuous smooth scratching
  const scratchStroke = (x, y) => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 48; // large, satisfying brush size

    if (lastPointRef.current) {
      ctx.beginPath();
      ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
      ctx.lineTo(x, y);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.arc(x, y, 24, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
    lastPointRef.current = { x, y };

    checkProgress();
  };

  // Sample transparent pixels to compute percentage
  const checkProgress = () => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    try {
      const imgData = ctx.getImageData(0, 0, w, h);
      const data = imgData.data;
      let transparent = 0;
      const step = 40; // sampling step for 60fps performance

      for (let i = 3; i < data.length; i += 4 * step) {
        if (data[i] < 128) {
          transparent++;
        }
      }

      const total = data.length / (4 * step);
      const percent = Math.min(100, Math.round((transparent / total) * 100));
      setScratchPercent(percent);

      if (percent >= autoRevealThreshold && !isRevealed) {
        triggerComplete();
      }
    } catch {
      // Ignored if cross-origin canvas security prevents reading
    }
  };

  const triggerComplete = () => {
    setIsRevealed(true);
    if (onRevealed) onRevealed();
  };

  // Pointer event handlers
  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const handlePointerDown = (e) => {
    if (isRevealed) return;
    isDrawingRef.current = true;
    const { x, y } = getCoordinates(e);
    scratchStroke(x, y);
  };

  const handlePointerMove = (e) => {
    if (!isDrawingRef.current || isRevealed) return;
    if (e.cancelable && e.touches) {
      e.preventDefault();
    }
    const { x, y } = getCoordinates(e);
    scratchStroke(x, y);
  };

  const handlePointerUp = () => {
    isDrawingRef.current = false;
    lastPointRef.current = null;
  };

  return (
    <div
      ref={containerRef}
      className={`scratch-card-container ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio,
        borderRadius: '8px',
        overflow: 'hidden',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        touchAction: 'none',
        ...style,
      }}
    >
      {/* Content under the scratch layer (Photo or Video) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
        }}
      >
        {children}
      </div>

      {/* Scratch Canvas Overlay */}
      <canvas
        ref={canvasRef}
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerUp}
        onMouseLeave={handlePointerUp}
        onTouchStart={handlePointerDown}
        onTouchMove={handlePointerMove}
        onTouchEnd={handlePointerUp}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          zIndex: 10,
          cursor: isRevealed ? 'default' : 'crosshair',
          opacity: isRevealed ? 0 : 1,
          pointerEvents: isRevealed ? 'none' : 'auto',
          transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      />

      {/* Quick Instant Reveal Button (visible when not yet fully revealed) */}
      {!isRevealed && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            triggerComplete();
          }}
          title="Instant Reveal"
          style={{
            position: 'absolute',
            bottom: '8px',
            right: '8px',
            zIndex: 15,
            padding: '3px 8px',
            borderRadius: '100px',
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(6px)',
            border: '1px solid rgba(232, 195, 125, 0.35)',
            color: 'rgba(245, 240, 235, 0.8)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.62rem',
            letterSpacing: '0.05em',
            cursor: 'pointer',
          }}
        >
          Reveal ✦
        </button>
      )}
    </div>
  );
}
