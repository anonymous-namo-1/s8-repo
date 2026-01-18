import React from 'react';
import { Check, Zap, Settings, Infinity } from 'lucide-react';
import { motion } from 'framer-motion';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useDeviceCapabilities } from '../hooks/useDeviceCapabilities';

const features = [
  {
    icon: Zap,
    title: "10,000+ ready-to-use workflows",
    description: "Massive collection covering marketing, sales, HR, finance, DevOps, and more.",
    stat: "10,000+"
  },
  {
    icon: Settings,
    title: "Easy to customize",
    description: "Modify workflows to fit your needs. Documentation included.",
    stat: "100%"
  },
  {
    icon: Infinity,
    title: "Lifetime access & updates",
    description: "One-time payment. Get all future workflow additions for free.",
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
              Automation workflows that save you hundreds of hours.
            </p>

            <p className="text-base text-muted-foreground/80 leading-relaxed mb-8">
              Stop building automations from scratch. Every workflow is ready to import,
              customize, and deploy. From simple tasks to complex multi-step integrations.
            </p>

            {/* Premium stats row */}
            <div className="flex gap-8 pt-6 border-t border-border/50">
              <div>
                <p className="text-3xl font-bold tracking-tight">₹99</p>
                <p className="text-xs text-muted-foreground mt-1">One-time</p>
              </div>
              <div className="w-px bg-border/50" />
              <div>
                <p className="text-3xl font-bold tracking-tight">10K+</p>
                <p className="text-xs text-muted-foreground mt-1">Workflows</p>
              </div>
              <div className="w-px bg-border/50" />
              <div>
                <p className="text-3xl font-bold tracking-tight">14</p>
                <p className="text-xs text-muted-foreground mt-1">Day Guarantee</p>
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
