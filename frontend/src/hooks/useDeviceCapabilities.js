import { useState, useEffect } from 'react';

export const ANIMATION_TIERS = {
  FULL: 'full',
  REDUCED: 'reduced',
  MINIMAL: 'minimal',
};

export function useDeviceCapabilities() {
  const [tier, setTier] = useState(ANIMATION_TIERS.FULL);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      setTier(ANIMATION_TIERS.MINIMAL);
      return;
    }

    // Check if touch device
    const isTouchDevice =
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia('(pointer: coarse)').matches;

    setIsTouch(isTouchDevice);

    // Check screen width for mobile
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;

    // Check device memory (if available)
    const deviceMemory = navigator.deviceMemory || 8;
    const isLowMemory = deviceMemory < 4;

    // Check hardware concurrency
    const cores = navigator.hardwareConcurrency || 4;
    const isLowCores = cores < 4;

    // Determine tier
    if (isMobile || isLowMemory || prefersReducedMotion) {
      setTier(ANIMATION_TIERS.MINIMAL);
    } else if (isTablet || isTouchDevice || isLowCores) {
      setTier(ANIMATION_TIERS.REDUCED);
    } else {
      setTier(ANIMATION_TIERS.FULL);
    }

    // Listen for reduced motion changes
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (e) => {
      if (e.matches) {
        setTier(ANIMATION_TIERS.MINIMAL);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return {
    tier,
    isTouch,
    isFull: tier === ANIMATION_TIERS.FULL,
    isReduced: tier === ANIMATION_TIERS.REDUCED,
    isMinimal: tier === ANIMATION_TIERS.MINIMAL,
  };
}
