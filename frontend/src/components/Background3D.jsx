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
        dotSize: 1.5,
        spacing: 12,
        waveSpeed: 4.5,
        waveWidth: 150,
        maxWaves: 8,
        liftHeight: 25,
        trailDecay: 0.94,
      };
    } else if (tier === 'reduced') {
      return {
        dotSize: 1.4,
        spacing: 18,
        waveSpeed: 4,
        waveWidth: 120,
        maxWaves: 5,
        liftHeight: 20,
        trailDecay: 0.92,
      };
    } else {
      return {
        dotSize: 1.3,
        spacing: 25,
        waveSpeed: 3.5,
        waveWidth: 100,
        maxWaves: 3,
        liftHeight: 15,
        trailDecay: 0.9,
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
    ) + 200;

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
          lift: 0,
          targetLift: 0,
          scale: 1,
          targetScale: 1,
        };
      }
    }

    const waveWidth = config.waveWidth;
    const waveSpeed = config.waveSpeed;
    const liftHeight = config.liftHeight;
    const decay = config.trailDecay;
    const dotSize = config.dotSize;

    const animate = () => {
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);

      const waves = wavesRef.current;
      for (let i = waves.length - 1; i >= 0; i--) {
        waves[i].radius += waveSpeed;
        if (waves[i].radius >= waves[i].maxRadius) {
          waves.splice(i, 1);
        }
      }

      const dots = dotsRef.current;
      const numDots = dots.length;
      const numWaves = waves.length;

      for (let i = 0; i < numDots; i++) {
        const dot = dots[i];
        let maxLift = 0;
        let maxScale = 1;

        for (let w = 0; w < numWaves; w++) {
          const wave = waves[w];
          const dx = dot.bx - wave.x;
          const dy = dot.by - wave.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          const inner = wave.radius - waveWidth;
          const outer = wave.radius;
          
          if (dist >= inner && dist <= outer) {
            const pos = (dist - inner) / waveWidth;
            const waveShape = Math.sin(pos * Math.PI);
            
            const lift = waveShape * liftHeight;
            const scale = 1 + waveShape * 1.2;
            
            if (lift > maxLift) {
              maxLift = lift;
              maxScale = scale;
            }
          }
        }

        dot.targetLift = maxLift;
        dot.targetScale = maxScale;
        
        dot.lift += (dot.targetLift - dot.lift) * 0.2;
        dot.scale += (dot.targetScale - dot.scale) * 0.2;
        
        if (dot.targetLift === 0) {
          dot.lift *= decay;
          dot.scale = 1 + (dot.scale - 1) * decay;
        }

        if (dot.lift > 0.3 || dot.scale > 1.02) {
          const x = dot.bx;
          const y = dot.by - dot.lift;
          
          const size = dotSize * dot.scale;
          const normalizedLift = Math.min(dot.lift / liftHeight, 1);
          const alpha = 0.25 + normalizedLift * 0.7;

          const shadowY = dot.by + 2;
          const shadowAlpha = normalizedLift * 0.15;
          ctx.beginPath();
          ctx.arc(x, shadowY, size * 0.8, 0, 6.28);
          ctx.fillStyle = `rgba(0,0,0,${shadowAlpha})`;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(x, y, size, 0, 6.28);
          ctx.fillStyle = `rgba(59,130,246,${alpha})`;
          ctx.fill();

          if (normalizedLift > 0.3) {
            ctx.beginPath();
            ctx.arc(x - size * 0.25, y - size * 0.25, size * 0.35, 0, 6.28);
            ctx.fillStyle = `rgba(147,197,253,${normalizedLift * 0.6})`;
            ctx.fill();
          }
        } else if (dot.lift < 0.2 && dot.scale < 1.01) {
          dot.lift = 0;
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
