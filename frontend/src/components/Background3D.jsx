import React, { useRef, useEffect, useCallback, useState } from 'react';
import { useDeviceCapabilities } from '../hooks/useDeviceCapabilities';

export function Background3D() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const animationRef = useRef(null);
  const wavesRef = useRef([]);
  const { tier } = useDeviceCapabilities();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const config = React.useMemo(() => {
    const baseConfig = {
      dotSize: 4,
      spacing: 20,
      waveSpeed: 4,
      waveWidth: 60,
      maxWaves: 5,
    };

    if (tier === 'full') {
      return { ...baseConfig, spacing: 18, dotSize: 4.5, maxWaves: 8, waveWidth: 70 };
    } else if (tier === 'reduced') {
      return { ...baseConfig, spacing: 25, dotSize: 4, maxWaves: 4, waveWidth: 55 };
    } else {
      return { ...baseConfig, spacing: 35, dotSize: 3.5, maxWaves: 3, waveWidth: 45 };
    }
  }, [tier]);

  const handleClick = useCallback((e) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

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
      ) + 100,
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
        });
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);

      wavesRef.current = wavesRef.current.filter(wave => {
        wave.radius += config.waveSpeed;
        return wave.radius < wave.maxRadius;
      });

      if (wavesRef.current.length === 0) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      dots.forEach((dot) => {
        let maxAlpha = 0;
        let maxScale = 1;

        wavesRef.current.forEach(wave => {
          const dx = dot.x - wave.x;
          const dy = dot.y - wave.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          const innerRadius = wave.radius - config.waveWidth;
          const outerRadius = wave.radius;
          
          if (distance >= innerRadius && distance <= outerRadius) {
            const positionInWave = (distance - innerRadius) / config.waveWidth;
            
            const alpha = Math.sin(positionInWave * Math.PI);
            const scale = 1 + Math.sin(positionInWave * Math.PI) * 0.8;
            
            if (alpha > maxAlpha) {
              maxAlpha = alpha;
              maxScale = scale;
            }
          }
        });

        if (maxAlpha > 0.02) {
          const size = config.dotSize * maxScale;
          
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, size * 1.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(59, 130, 246, ${maxAlpha * 0.15})`;
          ctx.fill();
          
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(59, 130, 246, ${maxAlpha * 0.7})`;
          ctx.fill();
          
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, size * 0.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(147, 197, 253, ${maxAlpha * 0.9})`;
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
      className="absolute inset-0 overflow-hidden"
      style={{ zIndex: 0 }}
      onClick={handleClick}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ background: 'transparent' }}
      />
    </div>
  );
}
