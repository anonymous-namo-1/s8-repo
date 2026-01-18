import React from 'react';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useDeviceCapabilities } from '../hooks/useDeviceCapabilities';

const features = [
  {
    title: "10,000+ ready-to-use workflows",
    description: "Massive collection covering marketing, sales, HR, finance, DevOps, and more."
  },
  {
    title: "Easy to customize",
    description: "Modify workflows to fit your needs. Documentation included."
  },
  {
    title: "Lifetime access & updates",
    description: "One-time payment. Get all future workflow additions for free."
  }
];

export const WhySection = () => {
  const [leftRef, isLeftVisible] = useScrollAnimation(0.2);
  const [rightRef, isRightVisible] = useScrollAnimation(0.2);
  const { isFull, isMinimal } = useDeviceCapabilities();

  // 3D pop animation for check icons
  const iconVariants = {
    hidden: { scale: 0, rotateY: -90 },
    visible: (index) => ({
      scale: 1,
      rotateY: 0,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 15,
        delay: index * 0.15,
      },
    }),
  };

  // Feature text animation
  const featureVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: (index) => ({
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        delay: index * 0.15 + 0.1,
      },
    }),
  };

  return (
    <section id="features" className="w-full py-16 md:py-20 border-t border-border">
      <div className="container-slate">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
          {/* Left - Title with 3D slide-in */}
          <motion.div
            ref={leftRef}
            initial={{ opacity: 0, x: -30, rotateY: isMinimal ? 0 : 10 }}
            animate={isLeftVisible ? { opacity: 1, x: 0, rotateY: 0 } : { opacity: 0, x: -30, rotateY: isMinimal ? 0 : 10 }}
            transition={{ duration: 0.6, type: 'spring', stiffness: 100, damping: 20 }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-4">
              Why Syntheight
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground mb-4 leading-relaxed">
              Automation workflows that save you hundreds of hours.
            </p>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Stop building automations from scratch. Every workflow is ready to import,
              customize, and deploy. From simple tasks to complex multi-step integrations.
            </p>
          </motion.div>

          {/* Right - Features with 3D icon pop */}
          <div
            ref={rightRef}
            className="space-y-5"
            style={{ perspective: isFull ? '800px' : 'none' }}
          >
            {features.map((feature, index) => (
              <div key={index} className="flex gap-4">
                {/* 3D animated check icon */}
                <motion.div
                  custom={index}
                  variants={iconVariants}
                  initial="hidden"
                  animate={isRightVisible ? 'visible' : 'hidden'}
                  className="flex-shrink-0 w-5 h-5 flex items-center justify-center bg-foreground text-background mt-0.5"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <Check className="w-3 h-3" strokeWidth={3} />
                </motion.div>

                {/* Feature text */}
                <motion.div
                  custom={index}
                  variants={featureVariants}
                  initial="hidden"
                  animate={isRightVisible ? 'visible' : 'hidden'}
                >
                  <h3 className="font-semibold text-sm sm:text-base mb-0.5">{feature.title}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
