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
        dotSize: 2,
        spacing: 14,
        waveSpeed: 3.5,
        waveWidth: 120,
        maxWaves: 8,
        floatAmplitude: 3,
        floatSpeed: 0.0015,
        trailLength: 0.88,
        glowIntensity: 0.4,
      };
    } else if (tier === 'reduced') {
      return {
        dotSize: 1.8,
        spacing: 20,
        waveSpeed: 3,
        waveWidth: 100,
        maxWaves: 5,
        floatAmplitude: 2.5,
        floatSpeed: 0.0012,
        trailLength: 0.85,
        glowIntensity: 0.35,
      };
    } else {
      return {
        dotSize: 1.6,
        spacing: 28,
        waveSpeed: 2.5,
        waveWidth: 80,
        maxWaves: 3,
        floatAmplitude: 2,
        floatSpeed: 0.001,
        trailLength: 0.82,
        glowIntensity: 0.3,
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

    wavesRef.current.push({
      x,
      y,
      radius: 0,
      maxRadius: Math.max(
        Math.sqrt(x * x + y * y),
        Math.sqrt((rect.width - x) ** 2 + y ** 2),
        Math.sqrt(x ** 2 + (rect.height - y) ** 2),
        Math.sqrt((rect.width - x) ** 2 + (rect.height - y) ** 2)
      ) + 200,
      timestamp: Date.now(),
      intensity: 1,
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

    dotsRef.current = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        dotsRef.current.push({
          baseX: offsetX + col * config.spacing,
          baseY: offsetY + row * config.spacing,
          x: offsetX + col * config.spacing,
          y: offsetY + row * config.spacing,
          energy: 0,
          targetEnergy: 0,
          phase: Math.random() * Math.PI * 2,
          floatOffset: Math.random() * Math.PI * 2,
          velocityY: 0,
        });
      }
    }

    let lastTime = performance.now();

    const animate = (currentTime) => {
      const deltaTime = Math.min(currentTime - lastTime, 50);
      lastTime = currentTime;
      
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);

      wavesRef.current = wavesRef.current.filter(wave => {
        wave.radius += config.waveSpeed * (deltaTime / 16);
        wave.intensity = Math.max(0, 1 - (wave.radius / wave.maxRadius) * 0.3);
        return wave.radius < wave.maxRadius;
      });

      const time = currentTime * config.floatSpeed;

      dotsRef.current.forEach((dot) => {
        let maxEnergy = 0;
        let waveForceY = 0;

        wavesRef.current.forEach(wave => {
          const dx = dot.baseX - wave.x;
          const dy = dot.baseY - wave.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          const innerRadius = wave.radius - config.waveWidth;
          const outerRadius = wave.radius;
          
          if (distance >= innerRadius - 20 && distance <= outerRadius + 20) {
            const normalizedPos = Math.max(0, Math.min(1, (distance - innerRadius) / config.waveWidth));
            const waveShape = Math.sin(normalizedPos * Math.PI);
            const energy = waveShape * wave.intensity;
            
            if (energy > maxEnergy) {
              maxEnergy = energy;
            }

            const angle = Math.atan2(dy, dx);
            waveForceY += Math.sin(angle) * energy * 8;
          }
        });

        dot.targetEnergy = maxEnergy;
        dot.energy += (dot.targetEnergy - dot.energy) * 0.15;
        
        if (dot.energy < 0.005) {
          dot.energy *= config.trailLength;
        }

        dot.velocityY += waveForceY * 0.1;
        dot.velocityY *= 0.92;

        const floatY = Math.sin(time + dot.floatOffset) * config.floatAmplitude * (0.3 + dot.energy * 0.7);
        const floatX = Math.cos(time * 0.7 + dot.floatOffset) * config.floatAmplitude * 0.5 * (0.2 + dot.energy * 0.8);
        
        dot.x = dot.baseX + floatX + dot.velocityY * 0.5;
        dot.y = dot.baseY + floatY + dot.velocityY;

        if (dot.energy > 0.01) {
          const displayEnergy = dot.energy;
          const pulse = 1 + Math.sin(time * 4 + dot.phase) * 0.15 * displayEnergy;
          const size = config.dotSize * (1 + displayEnergy * 0.8) * pulse;
          
          const alpha = Math.min(1, displayEnergy * 1.2);
          
          const glowSize = size * (2.5 + displayEnergy * 1.5);
          const gradient = ctx.createRadialGradient(dot.x, dot.y, 0, dot.x, dot.y, glowSize);
          gradient.addColorStop(0, `rgba(59, 130, 246, ${alpha * config.glowIntensity})`);
          gradient.addColorStop(0.4, `rgba(59, 130, 246, ${alpha * config.glowIntensity * 0.4})`);
          gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
          
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, glowSize, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();
          
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(96, 165, 250, ${alpha * 0.9})`;
          ctx.fill();
          
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, size * 0.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(191, 219, 254, ${alpha})`;
          ctx.fill();
        }
      });

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
