import React from 'react';
import { Check, Zap, Settings, Infinity } from 'lucide-react';
import { motion } from 'framer-motion';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useDeviceCapabilities } from '../hooks/useDeviceCapabilities';

const features = [
  {
    icon: Zap,
    title: "Premium quality assets",
    description: "Carefully curated templates, workflows, and tools designed for professionals.",
    stat: "Premium"
  },
  {
    icon: Settings,
    title: "Easy to customize",
    description: "Every asset is fully customizable. Documentation included.",
    stat: "100%"
  },
  {
    icon: Infinity,
    title: "Lifetime access & updates",
    description: "One-time payment. Get all future updates for free.",
    stat: "Forever"
  }
];

export const WhySection = () => {
  const [leftRef, isLeftVisible] = useScrollAnimation(0.2);
  const [rightRef, isRightVisible] = useScrollAnimation(0.2);
  const { isFull, isMinimal } = useDeviceCapabilities();

  // 3D pop animation for icons
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

  // Feature card animation
  const cardVariants = {
    hidden: { opacity: 0, x: 30, y: 10 },
    visible: (index) => ({
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.15 + 0.1,
        ease: [0.25, 0.1, 0.25, 1],
      },
    }),
  };

  return (
    <section id="features" className="w-full py-20 md:py-28 border-t border-border relative overflow-hidden">
      {/* Subtle background accent */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-secondary/50 to-transparent pointer-events-none" />

      <div className="container-slate relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left - Title with premium styling */}
          <motion.div
            ref={leftRef}
            initial={{ opacity: 0, x: -40 }}
            animate={isLeftVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={isLeftVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-block text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em] mb-4"
            >
              Why choose us
            </motion.span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6 leading-tight">
              Why Syntheight
            </h2>

            <p className="text-lg sm:text-xl text-muted-foreground mb-6 leading-relaxed">
              Premium digital assets that save you time and money.
            </p>

            <p className="text-base text-muted-foreground/80 leading-relaxed mb-8">
              Stop building from scratch. Every asset is ready to use, customize, and deploy.
              From templates to workflows to complete solutions.
            </p>

            {/* Premium stats row */}
            <div className="flex gap-8 pt-6 border-t border-border/50">
              <div>
                <p className="text-3xl font-bold tracking-tight">Premium</p>
                <p className="text-xs text-muted-foreground mt-1">Quality</p>
              </div>
              <div className="w-px bg-border/50" />
              <div>
                <p className="text-3xl font-bold tracking-tight">Instant</p>
                <p className="text-xs text-muted-foreground mt-1">Download</p>
              </div>
              <div className="w-px bg-border/50" />
              <div>
                <p className="text-3xl font-bold tracking-tight">24/7</p>
                <p className="text-xs text-muted-foreground mt-1">Automation</p>
              </div>
            </div>
          </motion.div>

          {/* Right - Features with premium cards */}
          <div
            ref={rightRef}
            className="space-y-5"
            style={{ perspective: isFull ? '1000px' : 'none' }}
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  custom={index}
                  variants={cardVariants}
                  initial="hidden"
                  animate={isRightVisible ? 'visible' : 'hidden'}
                  className="group relative p-6 bg-background border border-border hover:shadow-[0_15px_40px_rgba(0,0,0,0.08)] transition-all duration-500"
                >
                  {/* Hover accent line */}
                  <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-foreground scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-top" />

                  <div className="flex gap-5">
                    {/* Icon container */}
                    <motion.div
                      custom={index}
                      variants={iconVariants}
                      initial="hidden"
                      animate={isRightVisible ? 'visible' : 'hidden'}
                      className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-foreground text-background"
                      style={{ transformStyle: 'preserve-3d' }}
                    >
                      <Icon className="w-5 h-5" strokeWidth={2} />
                    </motion.div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-base sm:text-lg">{feature.title}</h3>
                        <span className="text-xs font-bold text-muted-foreground/50 bg-secondary px-2 py-1">
                          {feature.stat}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
