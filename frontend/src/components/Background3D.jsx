import React, { useRef, useEffect, useCallback, useState } from 'react';
import { useDeviceCapabilities } from '../hooks/useDeviceCapabilities';

export function Background3D() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const animationRef = useRef(null);
  const dotsRef = useRef([]);
  const wavesRef = useRef([]);
  const timeRef = useRef(0);
  const scaledRef = useRef(false);
  const { tier } = useDeviceCapabilities();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const config = React.useMemo(() => {
    const baseConfig = {
      dotColor: 'rgba(59, 130, 246, 0.6)',
      dotColorActive: 'rgba(59, 130, 246, 0.9)',
      dotSize: 3,
      spacing: 25,
      waveSpeed: 0.15,
      waveDecay: 0.985,
      waveAmplitude: 25,
      ambientWaveSpeed: 0.0008,
      ambientWaveAmplitude: 8,
      perspectiveStrength: 0.4,
      maxWaves: 5,
    };

    if (tier === 'full') {
      return { ...baseConfig, spacing: 22, dotSize: 3.5, maxWaves: 8 };
    } else if (tier === 'reduced') {
      return { ...baseConfig, spacing: 30, dotSize: 3, maxWaves: 4 };
    } else {
      return { ...baseConfig, spacing: 40, dotSize: 2.5, maxWaves: 2, ambientWaveAmplitude: 4 };
    }
  }, [tier]);

  const initDots = useCallback((width, height) => {
    const dots = [];
    const cols = Math.ceil(width / config.spacing) + 2;
    const rows = Math.ceil(height / config.spacing) + 2;
    const offsetX = (width - (cols - 1) * config.spacing) / 2;
    const offsetY = (height - (rows - 1) * config.spacing) / 2;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        dots.push({
          baseX: offsetX + col * config.spacing,
          baseY: offsetY + row * config.spacing,
          x: offsetX + col * config.spacing,
          y: offsetY + row * config.spacing,
          z: 0,
          scale: 1,
          row,
          col,
        });
      }
    }
    return dots;
  }, [config.spacing]);

  const handleClick = useCallback((e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (wavesRef.current.length >= config.maxWaves) {
      wavesRef.current.shift();
    }

    wavesRef.current.push({
      x,
      y,
      radius: 0,
      strength: 1,
      timestamp: Date.now(),
    });
  }, [config.maxWaves]);

  useEffect(() => {
    const updateDimensions = () => {
      const container = containerRef.current;
      if (container) {
        const width = container.offsetWidth;
        const height = container.offsetHeight;
        setDimensions({ width, height });
        dotsRef.current = initDots(width, height);
        scaledRef.current = false;
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [initDots]);

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

    if (prefersReducedMotion) {
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);
      dotsRef.current.forEach((dot) => {
        ctx.beginPath();
        ctx.arc(dot.baseX, dot.baseY, config.dotSize, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(59, 130, 246, 0.4)';
        ctx.fill();
      });
      return;
    }

    const animate = () => {
      timeRef.current += 1;
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);

      wavesRef.current = wavesRef.current.filter(wave => {
        wave.radius += config.waveSpeed * 15;
        wave.strength *= config.waveDecay;
        return wave.strength > 0.01;
      });

      const centerX = dimensions.width / 2;
      const centerY = dimensions.height / 2;

      dotsRef.current.forEach((dot) => {
        let totalZ = 0;

        const ambientOffset = 
          Math.sin(dot.baseX * 0.01 + timeRef.current * config.ambientWaveSpeed * 2) *
          Math.cos(dot.baseY * 0.01 + timeRef.current * config.ambientWaveSpeed * 1.5) *
          config.ambientWaveAmplitude;
        
        totalZ += ambientOffset;

        wavesRef.current.forEach(wave => {
          const dx = dot.baseX - wave.x;
          const dy = dot.baseY - wave.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          const waveWidth = 80;
          const distFromWave = Math.abs(distance - wave.radius);
          
          if (distFromWave < waveWidth) {
            const wavePhase = (distance - wave.radius) / waveWidth * Math.PI;
            const waveEffect = Math.sin(wavePhase) * wave.strength * config.waveAmplitude;
            totalZ += waveEffect;
          }
        });

        const perspectiveX = (dot.baseX - centerX) * config.perspectiveStrength * (totalZ / 100);
        const perspectiveY = (dot.baseY - centerY) * config.perspectiveStrength * (totalZ / 100);

        dot.x = dot.baseX + perspectiveX;
        dot.y = dot.baseY + perspectiveY;
        dot.z = totalZ;

        const baseScale = 1 + totalZ / 100;
        dot.scale = Math.max(0.3, Math.min(2.5, baseScale));
      });

      const sortedDots = [...dotsRef.current].sort((a, b) => a.z - b.z);

      sortedDots.forEach((dot) => {
        const brightness = Math.min(1, 0.4 + (dot.z + 30) / 60);
        const alpha = 0.3 + brightness * 0.5;
        
        const r = 59;
        const g = Math.round(130 + dot.z * 0.5);
        const b = 246;
        
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, config.dotSize * dot.scale, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        ctx.fill();

        if (dot.z > 5) {
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, config.dotSize * dot.scale * 1.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha * 0.2})`;
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
  }, [dimensions, config, prefersReducedMotion]);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0 }}
    >
      <div 
        className="absolute inset-0 pointer-events-auto"
        onClick={handleClick}
        style={{ cursor: 'default' }}
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ 
            background: 'transparent',
            pointerEvents: 'none',
          }}
        />
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-transparent to-background/80 pointer-events-none" />
    </div>
  );
}
