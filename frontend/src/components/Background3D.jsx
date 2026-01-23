import React, { useRef, useEffect, useCallback, useState, useImperativeHandle, forwardRef } from 'react';
import { useDeviceCapabilities } from '../hooks/useDeviceCapabilities';

export const Background3D = forwardRef(function Background3D(props, ref) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const animationRef = useRef(null);
  const wavesRef = useRef([]);
  const dotsRef = useRef([]);
  const { tier } = useDeviceCapabilities();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const config = React.useMemo(() => {
    if (tier === 'full') {
      return {
        dotSize: 2.2,
        spacing: 18,
        waveSpeed: 4,
        waveWidth: 100,
        maxWaves: 6,
        floatAmplitude: 2,
        trailDecay: 0.92,
      };
    } else if (tier === 'reduced') {
      return {
        dotSize: 2,
        spacing: 26,
        waveSpeed: 3.5,
        waveWidth: 85,
        maxWaves: 4,
        floatAmplitude: 1.5,
        trailDecay: 0.9,
      };
    } else {
      return {
        dotSize: 1.8,
        spacing: 35,
        waveSpeed: 3,
        waveWidth: 70,
        maxWaves: 3,
        floatAmplitude: 1,
        trailDecay: 0.88,
      };
    }
  }, [tier]);

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
    ) + 150;

    wavesRef.current.push({
      x,
      y,
      radius: 0,
      maxRadius,
    });
  }, [config.maxWaves]);

  useImperativeHandle(ref, () => ({
    triggerWave
  }), [triggerWave]);

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

    const { spacing } = config;
    const cols = Math.ceil(dimensions.width / spacing) + 1;
    const rows = Math.ceil(dimensions.height / spacing) + 1;
    const offsetX = (dimensions.width - (cols - 1) * spacing) / 2;
    const offsetY = (dimensions.height - (rows - 1) * spacing) / 2;

    dotsRef.current = new Array(rows * cols);
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const i = row * cols + col;
        dotsRef.current[i] = {
          bx: offsetX + col * spacing,
          by: offsetY + row * spacing,
          energy: 0,
          vy: 0,
          phase: (row + col) * 0.5,
        };
      }
    }

    const waveWidth = config.waveWidth;
    const waveSpeed = config.waveSpeed;
    const floatAmp = config.floatAmplitude;
    const decay = config.trailDecay;
    const dotSize = config.dotSize;

    const animate = (time) => {
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);

      const waves = wavesRef.current;
      for (let i = waves.length - 1; i >= 0; i--) {
        waves[i].radius += waveSpeed;
        if (waves[i].radius >= waves[i].maxRadius) {
          waves.splice(i, 1);
        }
      }

      const t = time * 0.002;
      const dots = dotsRef.current;
      const numDots = dots.length;
      const numWaves = waves.length;

      for (let i = 0; i < numDots; i++) {
        const dot = dots[i];
        let hitEnergy = 0;
        let pushY = 0;

        for (let w = 0; w < numWaves; w++) {
          const wave = waves[w];
          const dx = dot.bx - wave.x;
          const dy = dot.by - wave.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          const inner = wave.radius - waveWidth;
          const outer = wave.radius;
          
          if (dist >= inner && dist <= outer) {
            const pos = (dist - inner) / waveWidth;
            const e = Math.sin(pos * Math.PI);
            if (e > hitEnergy) hitEnergy = e;
            pushY += (dy / (dist || 1)) * e * 4;
          }
        }

        if (hitEnergy > dot.energy) {
          dot.energy = hitEnergy;
        } else {
          dot.energy *= decay;
        }

        dot.vy = dot.vy * 0.9 + pushY * 0.08;
        
        if (dot.energy > 0.02) {
          const e = dot.energy;
          const float = Math.sin(t + dot.phase) * floatAmp * e;
          const x = dot.bx;
          const y = dot.by + float + dot.vy;
          
          const size = dotSize * (1 + e * 0.5);
          const alpha = e * 0.85;

          ctx.beginPath();
          ctx.arc(x, y, size * 2.2, 0, 6.28);
          ctx.fillStyle = `rgba(59,130,246,${alpha * 0.18})`;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(x, y, size, 0, 6.28);
          ctx.fillStyle = `rgba(96,165,250,${alpha * 0.85})`;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(x, y, size * 0.4, 0, 6.28);
          ctx.fillStyle = `rgba(219,234,254,${alpha})`;
          ctx.fill();
        } else if (dot.energy < 0.01) {
          dot.energy = 0;
          dot.vy = 0;
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
