import React, { useRef, useEffect, useCallback, useState, useImperativeHandle, forwardRef } from 'react';
import { useDeviceCapabilities } from '../hooks/useDeviceCapabilities';

export const Background3D = forwardRef(function Background3D(props, ref) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const animationRef = useRef(null);
  const wavesRef = useRef([]);
  const { tier } = useDeviceCapabilities();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const config = React.useMemo(() => {
    const baseConfig = {
      dotSize: 2.5,
      spacing: 12,
      waveSpeed: 5,
      waveWidth: 80,
      maxWaves: 6,
      resonanceDecay: 0.92,
    };

    if (tier === 'full') {
      return { ...baseConfig, spacing: 10, dotSize: 2.5, maxWaves: 10, waveWidth: 90 };
    } else if (tier === 'reduced') {
      return { ...baseConfig, spacing: 16, dotSize: 2.2, maxWaves: 5, waveWidth: 70 };
    } else {
      return { ...baseConfig, spacing: 22, dotSize: 2, maxWaves: 3, waveWidth: 55 };
    }
  }, [tier]);

  const triggerWave = useCallback((x, y) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();

    if (wavesRef.current.length >= config.maxWaves) {
      wavesRef.current.shift();
    }

    wavesRef.current.push({
      x,
      y,
      radius: 0,
      maxRadius: Math.max(
        Math.sqrt(x * x + y * y),
        Math.sqrt((rect.width - x) ** 2 + y ** 2),
        Math.sqrt(x ** 2 + (rect.height - y) ** 2),
        Math.sqrt((rect.width - x) ** 2 + (rect.height - y) ** 2)
      ) + 150,
      timestamp: Date.now(),
    });
  }, [config.maxWaves]);

  useImperativeHandle(ref, () => ({
    triggerWave
  }), [triggerWave]);

  useEffect(() => {
    const updateDimensions = () => {
      const container = containerRef.current;
      if (container) {
        const width = container.offsetWidth;
        const height = container.offsetHeight;
        setDimensions({ width, height });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || dimensions.width === 0) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    
    canvas.width = dimensions.width * dpr;
    canvas.height = dimensions.height * dpr;
    canvas.style.width = `${dimensions.width}px`;
    canvas.style.height = `${dimensions.height}px`;
    
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    const cols = Math.ceil(dimensions.width / config.spacing) + 2;
    const rows = Math.ceil(dimensions.height / config.spacing) + 2;
    const offsetX = (dimensions.width - (cols - 1) * config.spacing) / 2;
    const offsetY = (dimensions.height - (rows - 1) * config.spacing) / 2;

    const dots = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        dots.push({
          x: offsetX + col * config.spacing,
          y: offsetY + row * config.spacing,
          resonance: 0,
          resonancePhase: 0,
        });
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);

      wavesRef.current = wavesRef.current.filter(wave => {
        wave.radius += config.waveSpeed;
        return wave.radius < wave.maxRadius;
      });

      const time = Date.now() * 0.008;

      dots.forEach((dot) => {
        let maxEnergy = 0;
        let hitByWave = false;

        wavesRef.current.forEach(wave => {
          const dx = dot.x - wave.x;
          const dy = dot.y - wave.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          const innerRadius = wave.radius - config.waveWidth;
          const outerRadius = wave.radius;
          
          if (distance >= innerRadius && distance <= outerRadius) {
            hitByWave = true;
            const positionInWave = (distance - innerRadius) / config.waveWidth;
            const energy = Math.sin(positionInWave * Math.PI);
            
            if (energy > maxEnergy) {
              maxEnergy = energy;
            }
            
            if (energy > dot.resonance) {
              dot.resonance = energy;
              dot.resonancePhase = time;
            }
          }
        });

        if (!hitByWave && dot.resonance > 0) {
          dot.resonance *= config.resonanceDecay;
          if (dot.resonance < 0.01) {
            dot.resonance = 0;
          }
        }

        const displayEnergy = Math.max(maxEnergy, dot.resonance);

        if (displayEnergy > 0.01) {
          const resonanceOscillation = dot.resonance > 0.01 
            ? Math.sin((time - dot.resonancePhase) * 8) * 0.3 * dot.resonance 
            : 0;
          
          const scale = 1 + displayEnergy * 0.6 + resonanceOscillation;
          const size = config.dotSize * scale;
          
          const alpha = displayEnergy * 0.85;
          
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, size * 1.8, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(59, 130, 246, ${alpha * 0.12})`;
          ctx.fill();
          
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(59, 130, 246, ${alpha * 0.75})`;
          ctx.fill();
          
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, size * 0.4, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(147, 197, 253, ${alpha * 0.95})`;
          ctx.fill();
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

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
      style={{ zIndex: 0 }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ background: 'transparent' }}
      />
    </div>
  );
});
