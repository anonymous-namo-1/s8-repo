import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useDeviceCapabilities } from '../hooks/useDeviceCapabilities';
import { useMousePosition } from '../hooks/useMousePosition';

const shapes = [
  // Premium geometric shapes - right side positioning
  { type: 'square', size: 70, x: '72%', y: '12%', delay: 0, duration: 8, strokeWidth: 1 },
  { type: 'circle', size: 50, x: '85%', y: '30%', delay: 0.5, duration: 10, strokeWidth: 1 },
  { type: 'square', size: 90, x: '68%', y: '55%', delay: 1, duration: 12, strokeWidth: 1 },
  { type: 'line', width: 120, x: '78%', y: '72%', delay: 1.5, duration: 9 },
  { type: 'circle', size: 35, x: '92%', y: '18%', delay: 2, duration: 11, strokeWidth: 1 },
  // Top right corner - subtle accents
  { type: 'square', size: 55, x: '62%', y: '3%', delay: 0.8, duration: 10, strokeWidth: 1 },
  { type: 'dot', size: 6, x: '76%', y: '42%', delay: 0.3, duration: 7 },
  { type: 'dot', size: 4, x: '88%', y: '50%', delay: 1.2, duration: 8 },
  { type: 'dot', size: 5, x: '82%', y: '65%', delay: 0.9, duration: 6 },
  // Additional premium elements
  { type: 'line', width: 80, x: '70%', y: '82%', delay: 2, duration: 9, rotate: 45 },
  { type: 'circle', size: 25, x: '95%', y: '68%', delay: 0.7, duration: 10, strokeWidth: 1 },
  { type: 'cross', size: 20, x: '80%', y: '88%', delay: 1.8, duration: 8 },
  { type: 'ring', size: 40, x: '60%', y: '75%', delay: 1.3, duration: 11, strokeWidth: 1 },
];

const ShapeComponent = ({ shape, mouseX, mouseY, isFull }) => {
  const parallaxX = isFull ? (mouseX - 0.5) * 25 : 0;
  const parallaxY = isFull ? (mouseY - 0.5) * 25 : 0;

  const baseStyle = {
    position: 'absolute',
    left: shape.x,
    top: shape.y,
    opacity: 0.06,
  };

  const floatVariants = {
    animate: {
      y: [0, -25, 0],
      rotate: shape.rotate ? [shape.rotate, shape.rotate + 8, shape.rotate] : [0, 5, 0],
      scale: [1, 1.02, 1],
      transition: {
        duration: shape.duration,
        ease: 'easeInOut',
        repeat: Infinity,
        delay: shape.delay,
      },
    },
  };

  if (shape.type === 'square') {
    return (
      <motion.div
        style={{
          ...baseStyle,
          width: shape.size,
          height: shape.size,
          border: `${shape.strokeWidth || 1}px solid currentColor`,
          x: parallaxX,
          y: parallaxY,
        }}
        variants={floatVariants}
        animate="animate"
      />
    );
  }

  if (shape.type === 'circle') {
    return (
      <motion.div
        style={{
          ...baseStyle,
          width: shape.size,
          height: shape.size,
          borderRadius: '50%',
          border: `${shape.strokeWidth || 1}px solid currentColor`,
          x: parallaxX * 1.3,
          y: parallaxY * 1.3,
        }}
        variants={floatVariants}
        animate="animate"
      />
    );
  }

  if (shape.type === 'ring') {
    return (
      <motion.div
        style={{
          ...baseStyle,
          width: shape.size,
          height: shape.size,
          borderRadius: '50%',
          border: `${shape.strokeWidth || 1}px solid currentColor`,
          boxShadow: `inset 0 0 0 ${shape.size / 4}px transparent`,
          x: parallaxX * 1.1,
          y: parallaxY * 1.1,
        }}
        variants={floatVariants}
        animate="animate"
      />
    );
  }

  if (shape.type === 'line') {
    return (
      <motion.div
        style={{
          ...baseStyle,
          width: shape.width,
          height: 1,
          backgroundColor: 'currentColor',
          transformOrigin: 'center',
          x: parallaxX * 0.8,
          y: parallaxY * 0.8,
        }}
        variants={floatVariants}
        animate="animate"
      />
    );
  }

  if (shape.type === 'dot') {
    return (
      <motion.div
        style={{
          ...baseStyle,
          width: shape.size,
          height: shape.size,
          borderRadius: '50%',
          backgroundColor: 'currentColor',
          x: parallaxX * 1.5,
          y: parallaxY * 1.5,
        }}
        variants={floatVariants}
        animate="animate"
      />
    );
  }

  if (shape.type === 'cross') {
    return (
      <motion.div
        style={{
          ...baseStyle,
          width: shape.size,
          height: shape.size,
          x: parallaxX * 1.2,
          y: parallaxY * 1.2,
        }}
        variants={floatVariants}
        animate="animate"
      >
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: 0,
            width: '100%',
            height: 1,
            backgroundColor: 'currentColor',
            transform: 'translateY(-50%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            width: 1,
            height: '100%',
            backgroundColor: 'currentColor',
            transform: 'translateX(-50%)',
          }}
        />
      </motion.div>
    );
  }

  return null;
};

export const FloatingShapes = () => {
  const { isFull, isMinimal } = useDeviceCapabilities();
  const mousePosition = useMousePosition();

  // Normalize mouse position to 0-1 range based on viewport
  const mouseX = useMemo(
    () => (typeof window !== 'undefined' ? mousePosition.x / window.innerWidth : 0.5),
    [mousePosition.x]
  );
  const mouseY = useMemo(
    () => (typeof window !== 'undefined' ? mousePosition.y / window.innerHeight : 0.5),
    [mousePosition.y]
  );

  // Don't render on minimal tier (mobile/reduced motion)
  if (isMinimal) {
    return null;
  }

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none select-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      {/* Subtle gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-secondary/20 opacity-50" />

      <div className="relative w-full h-full text-foreground">
        {shapes.map((shape, index) => (
          <ShapeComponent
            key={index}
            shape={shape}
            mouseX={mouseX}
            mouseY={mouseY}
            isFull={isFull}
          />
        ))}
      </div>
    </div>
  );
};
