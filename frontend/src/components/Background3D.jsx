import React, { useRef, useEffect, useCallback, useState, useImperativeHandle, forwardRef } from 'react';
import { useDeviceCapabilities } from '../hooks/useDeviceCapabilities';

/**
 * Background3D - Interactive 3D Wave Animation Component
 * 
 * Creates a grid of dots that respond to clicks with a 3D wave effect.
 * Dots lift up, shift with parallax, and cast shadows for depth illusion.
 * 
 * Features:
 * - Click-triggered expanding wave rings
 * - 3D parallax shift (dots move away from click point)
 * - Vertical lift for depth illusion
 * - Dynamic shadows
 * - Device-adaptive performance tiers
 */
export const Background3D = forwardRef(function Background3D(props, ref) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const animationRef = useRef(null);
  const wavesRef = useRef([]);
  const dotsRef = useRef([]);
  const { tier } = useDeviceCapabilities();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Device-adaptive configuration
  const config = React.useMemo(() => {
    const base = {
      waveSpeed: 5,
      waveWidth: 180,
      liftHeight: 20,
      parallaxStrength: 12,
      trailDecay: 0.93,
    };

    if (tier === 'full') {
      return {
        ...base,
        dotSize: 1.2,
        spacing: 8,
        maxWaves: 10,
      };
    } else if (tier === 'reduced') {
      return {
        ...base,
        dotSize: 1.3,
        spacing: 14,
        maxWaves: 6,
        waveWidth: 150,
      };
    } else {
      return {
        ...base,
        dotSize: 1.4,
        spacing: 20,
        maxWaves: 4,
        waveWidth: 120,
        liftHeight: 15,
      };
    }
  }, [tier]);

  /**
   * Triggers a wave from the specified coordinates
   * @param {number} x - X coordinate relative to container
   * @param {number} y - Y coordinate relative to container
   */
  const triggerWave = useCallback((x, y) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();

    if (wavesRef.current.length >= config.maxWaves) {
      wavesRef.current.shift();
    }

    const maxRadius = Math.max(
      Math.hypot(x, y),
      Math.hypot(rect.width - x, y),
      Math.hypot(x, rect.height - y),
      Math.hypot(rect.width - x, rect.height - y)
    ) + 250;

    wavesRef.current.push({
      x,
      y,
      radius: 0,
      maxRadius,
      born: performance.now(),
    });
  }, [config.maxWaves]);

  useImperativeHandle(ref, () => ({ triggerWave }), [triggerWave]);

  useEffect(() => {
    const updateDimensions = () => {
      const container = containerRef.current;
      if (container) {
        setDimensions({ 
          width: container.offsetWidth, 
          height: container.offsetHeight 
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || dimensions.width === 0) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    
    canvas.width = dimensions.width * dpr;
    canvas.height = dimensions.height * dpr;
    canvas.style.width = `${dimensions.width}px`;
    canvas.style.height = `${dimensions.height}px`;
    ctx.scale(dpr, dpr);

    // Initialize dot grid
    const { spacing, dotSize, waveWidth, waveSpeed, liftHeight, parallaxStrength, trailDecay } = config;
    const cols = Math.ceil(dimensions.width / spacing) + 2;
    const rows = Math.ceil(dimensions.height / spacing) + 2;
    const offsetX = (dimensions.width - (cols - 1) * spacing) / 2;
    const offsetY = (dimensions.height - (rows - 1) * spacing) / 2;

    dotsRef.current = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        dotsRef.current.push({
          baseX: offsetX + col * spacing,
          baseY: offsetY + row * spacing,
          x: offsetX + col * spacing,
          y: offsetY + row * spacing,
          lift: 0,
          shiftX: 0,
          shiftY: 0,
          scale: 1,
          energy: 0,
        });
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);

      // Update waves
      const waves = wavesRef.current;
      for (let i = waves.length - 1; i >= 0; i--) {
        waves[i].radius += waveSpeed;
        if (waves[i].radius >= waves[i].maxRadius) {
          waves.splice(i, 1);
        }
      }

      const dots = dotsRef.current;
      const numWaves = waves.length;

      // Process each dot
      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];
        let maxEnergy = 0;
        let totalShiftX = 0;
        let totalShiftY = 0;

        // Calculate influence from all active waves
        for (let w = 0; w < numWaves; w++) {
          const wave = waves[w];
          const dx = dot.baseX - wave.x;
          const dy = dot.baseY - wave.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          const inner = wave.radius - waveWidth;
          const outer = wave.radius;
          
          if (dist >= inner && dist <= outer) {
            // Calculate wave intensity at this position
            const pos = (dist - inner) / waveWidth;
            const waveShape = Math.sin(pos * Math.PI);
            
            if (waveShape > maxEnergy) {
              maxEnergy = waveShape;
            }

            // Parallax shift - dots move away from wave origin
            const angle = Math.atan2(dy, dx);
            const shiftAmount = waveShape * parallaxStrength;
            totalShiftX += Math.cos(angle) * shiftAmount;
            totalShiftY += Math.sin(angle) * shiftAmount;
          }
        }

        // Smooth transitions
        const easing = 0.15;
        const targetLift = maxEnergy * liftHeight;
        const targetScale = 1 + maxEnergy * 0.8;

        dot.energy += (maxEnergy - dot.energy) * easing;
        dot.lift += (targetLift - dot.lift) * easing;
        dot.shiftX += (totalShiftX - dot.shiftX) * easing;
        dot.shiftY += (totalShiftY - dot.shiftY) * easing;
        dot.scale += (targetScale - dot.scale) * easing;

        // Apply decay when no waves affecting
        if (maxEnergy === 0) {
          dot.energy *= trailDecay;
          dot.lift *= trailDecay;
          dot.shiftX *= trailDecay;
          dot.shiftY *= trailDecay;
          dot.scale = 1 + (dot.scale - 1) * trailDecay;
        }

        // Calculate final position with parallax
        dot.x = dot.baseX + dot.shiftX;
        dot.y = dot.baseY - dot.lift + dot.shiftY * 0.5;

        // Render dot if visible
        if (dot.energy > 0.02) {
          const size = dotSize * dot.scale;
          const alpha = 0.15 + dot.energy * 0.75;

          // Shadow for 3D depth
          if (dot.lift > 1) {
            const shadowOffset = dot.lift * 0.3;
            const shadowAlpha = dot.energy * 0.12;
            ctx.beginPath();
            ctx.arc(dot.baseX + dot.shiftX, dot.baseY + shadowOffset, size * 0.9, 0, 6.283);
            ctx.fillStyle = `rgba(0,0,0,${shadowAlpha})`;
            ctx.fill();
          }

          // Main dot
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, size, 0, 6.283);
          ctx.fillStyle = `rgba(59,130,246,${alpha})`;
          ctx.fill();

          // Highlight for lifted dots
          if (dot.energy > 0.4) {
            ctx.beginPath();
            ctx.arc(dot.x - size * 0.2, dot.y - size * 0.2, size * 0.3, 0, 6.283);
            ctx.fillStyle = `rgba(191,219,254,${dot.energy * 0.5})`;
            ctx.fill();
          }
        } else if (dot.energy < 0.01) {
          // Reset inactive dots
          dot.energy = 0;
          dot.lift = 0;
          dot.shiftX = 0;
          dot.shiftY = 0;
          dot.scale = 1;
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [dimensions, config]);

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
});
