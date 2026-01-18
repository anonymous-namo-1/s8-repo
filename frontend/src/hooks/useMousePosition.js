import { useState, useEffect, useCallback, useRef } from 'react';

export function useMousePosition(throttleMs = 16) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const lastUpdate = useRef(0);

  const handleMouseMove = useCallback(
    (e) => {
      const now = Date.now();
      if (now - lastUpdate.current >= throttleMs) {
        lastUpdate.current = now;
        setPosition({ x: e.clientX, y: e.clientY });
      }
    },
    [throttleMs]
  );

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  return position;
}

export function useRelativeMousePosition(ref, enabled = true) {
  const [position, setPosition] = useState({ x: 0.5, y: 0.5 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (!enabled || !ref.current) return;

    const element = ref.current;

    const handleMouseMove = (e) => {
      const rect = element.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      setPosition({ x: Math.max(0, Math.min(1, x)), y: Math.max(0, Math.min(1, y)) });
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => {
      setIsHovering(false);
      setPosition({ x: 0.5, y: 0.5 });
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [ref, enabled]);

  return { position, isHovering };
}
