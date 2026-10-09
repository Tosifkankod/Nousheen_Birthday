import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

/**
 * Reusable ScratchCard Component
 * - 100% synchronized touch/pointer scratching for Android, iOS, and Desktop
 * - Direct coordinate mapping: (clientX - rect.left) / rect.width * canvas.width
 * - Pointer capture for smooth, uninterrupted finger scratching
 * - Textured matte charcoal scratch paper with golden speckles and elegant border
 * - Fast, non-blocking reveal sampling
 */
export default function ScratchCard({
  children,
  onRevealed,
  autoRevealThreshold = 28,
  watermark = '✦ Scratch with your finger to reveal ✦',
  className = '',
  style = {},
  aspectRatio = '4 / 5',
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef(null);
  const dprRef = useRef(1);

  const [isRevealed, setIsRevealed] = useState(false);
  const [scratchPercent, setScratchPercent] = useState(0);

  // Initialize canvas with matte black paper & golden speckles
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || isRevealed) return;

    const rect = container.getBoundingClientRect();
    const width = rect.width || container.offsetWidth;
    const height = rect.height || container.offsetHeight;
    if (width === 0 || height === 0) return;

    const dpr = Math.max(window.devicePixelRatio || 1, 1);
    dprRef.current = dpr;

    // Set real pixel resolution
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    // Reset any transform to identity
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    // Matte dark charcoal base
    ctx.fillStyle = '#0f0d0c';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Paper grain & subtle texture
    ctx.fillStyle = 'rgba(32, 24, 20, 0.45)';
    const grainCount = Math.floor(400 * dpr);
    for (let i = 0; i < grainCount; i++) {
      const rx = Math.random() * canvas.width;
      const ry = Math.random() * canvas.height;
      const rsize = (Math.random() * 2.5 + 0.8) * dpr;
      ctx.fillRect(rx, ry, rsize, rsize);
    }

    // Golden dust specks
    ctx.fillStyle = 'rgba(232, 195, 125, 0.4)';
    const dustCount = Math.floor(55 * dpr);
    for (let i = 0; i < dustCount; i++) {
      const gx = Math.random() * canvas.width;
      const gy = Math.random() * canvas.height;
      ctx.beginPath();
      ctx.arc(gx, gy, (Math.random() * 1.5 + 0.6) * dpr, 0, Math.PI * 2);
      ctx.fill();
    }

    // Delicate golden border frame
    ctx.strokeStyle = 'rgba(232, 195, 125, 0.28)';
    ctx.lineWidth = Math.max(1, 1 * dpr);
    const borderInset = 10 * dpr;
    ctx.strokeRect(borderInset, borderInset, canvas.width - borderInset * 2, canvas.height - borderInset * 2);

    // Watermark text in center
    if (watermark) {
      const fontSize = Math.max(12, Math.round(13 * dpr));
      ctx.font = `500 ${fontSize}px "Inter", -apple-system, sans-serif`;
      ctx.fillStyle = 'rgba(245, 240, 235, 0.5)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(watermark, canvas.width / 2, canvas.height / 2);
    }
  }, [isRevealed, watermark]);

  useEffect(() => {
    const timer = setTimeout(initCanvas, 100);
    window.addEventListener('resize', initCanvas);
    window.addEventListener('orientationchange', initCanvas);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', initCanvas);
      window.removeEventListener('orientationchange', initCanvas);
    };
  }, [initCanvas]);

  // Direct pixel scratch stroke
  const scratchStroke = (canvasX, canvasY) => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const dpr = dprRef.current || 1;
    const brushSize = Math.max(38, 48 * dpr);

    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = brushSize;

    if (lastPointRef.current) {
      ctx.beginPath();
      ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
      ctx.lineTo(canvasX, canvasY);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.arc(canvasX, canvasY, brushSize / 2, 0, Math.PI * 2);
      ctx.fill();
    }

    lastPointRef.current = { x: canvasX, y: canvasY };
    checkProgress();
  };

  // Sample transparent pixels to compute percentage
  const checkProgress = () => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    try {
      const w = canvas.width;
      const h = canvas.height;
      if (w === 0 || h === 0) return;

      const imgData = ctx.getImageData(0, 0, w, h);
      const data = imgData.data;
      let transparent = 0;
      const step = 48; // fast sampling step for smooth 60fps

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
      // Ignore security errors if any
    }
  };

  const triggerComplete = () => {
    setIsRevealed(true);
    if (onRevealed) onRevealed();
  };

  // Convert pointer / touch coordinates to exact canvas buffer coordinates
  const getCanvasCoordinates = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return { x: 0, y: 0 };

    let clientX = e.clientX;
    let clientY = e.clientY;

    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if (e.changedTouches && e.changedTouches.length > 0) {
      clientX = e.changedTouches[0].clientX;
      clientY = e.changedTouches[0].clientY;
    }

    // Precise ratio mapping
    const normX = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const normY = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));

    return {
      x: normX * canvas.width,
      y: normY * canvas.height,
    };
  };

  // Universal Pointer Events (Supports Touch, Stylus, Mouse on Android & iOS & Desktop)
  const handlePointerDown = (e) => {
    if (isRevealed) return;
    isDrawingRef.current = true;
    lastPointRef.current = null;

    try {
      e.target.setPointerCapture(e.pointerId);
    } catch {}

    const { x, y } = getCanvasCoordinates(e);
    scratchStroke(x, y);
  };

  const handlePointerMove = (e) => {
    if (!isDrawingRef.current || isRevealed) return;
    const { x, y } = getCanvasCoordinates(e);
    scratchStroke(x, y);
  };

  const handlePointerUp = (e) => {
    isDrawingRef.current = false;
    lastPointRef.current = null;
    try {
      e.target.releasePointerCapture(e.pointerId);
    } catch {}
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
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          zIndex: 10,
          cursor: isRevealed ? 'default' : 'crosshair',
          opacity: isRevealed ? 0 : 1,
          pointerEvents: isRevealed ? 'none' : 'auto',
          touchAction: 'none',
          WebkitTouchCallout: 'none',
          transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      />

      {/* Quick Instant Reveal Button */}
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
            background: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(6px)',
            border: '1px solid rgba(232, 195, 125, 0.35)',
            color: 'rgba(245, 240, 235, 0.85)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.62rem',
            letterSpacing: '0.05em',
            cursor: 'pointer',
            touchAction: 'manipulation',
          }}
        >
          Reveal ✦
        </button>
      )}
    </div>
  );
}
