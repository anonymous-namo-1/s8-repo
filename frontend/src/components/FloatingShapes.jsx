import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useDeviceCapabilities } from '../hooks/useDeviceCapabilities';
import { useMousePosition } from '../hooks/useMousePosition';

const shapes = [
  // Right side shapes - positioned away from text content
  { type: 'square', size: 60, x: '75%', y: '15%', delay: 0, duration: 6 },
  { type: 'circle', size: 40, x: '85%', y: '35%', delay: 0.5, duration: 7 },
  { type: 'square', size: 80, x: '70%', y: '60%', delay: 1, duration: 8 },
  { type: 'line', width: 100, x: '80%', y: '75%', delay: 1.5, duration: 6 },
  { type: 'circle', size: 30, x: '90%', y: '20%', delay: 2, duration: 7 },
  // Top right corner
  { type: 'square', size: 50, x: '65%', y: '5%', delay: 0.8, duration: 9 },
  { type: 'dot', size: 8, x: '78%', y: '45%', delay: 0.3, duration: 5 },
  { type: 'dot', size: 6, x: '88%', y: '55%', delay: 1.2, duration: 6 },
  // Additional scattered elements
  { type: 'line', width: 60, x: '72%', y: '85%', delay: 2, duration: 7, rotate: 45 },
  { type: 'circle', size: 20, x: '95%', y: '70%', delay: 0.7, duration: 8 },
];

const ShapeComponent = ({ shape, mouseX, mouseY, isFull }) => {
  const parallaxX = isFull ? (mouseX - 0.5) * 20 : 0;
  const parallaxY = isFull ? (mouseY - 0.5) * 20 : 0;

  const baseStyle = {
    position: 'absolute',
    left: shape.x,
    top: shape.y,
    opacity: 0.08,
  };

  const floatVariants = {
    animate: {
      y: [0, -20, 0],
      rotate: shape.rotate ? [shape.rotate, shape.rotate + 5, shape.rotate] : [0, 3, 0],
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
          border: '2px solid currentColor',
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
          border: '2px solid currentColor',
          x: parallaxX * 1.2,
          y: parallaxY * 1.2,
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
          height: 2,
          backgroundColor: 'currentColor',
          transform: shape.rotate ? `rotate(${shape.rotate}deg)` : 'none',
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
      style={{ zIndex: -1 }}
      aria-hidden="true"
    >
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
