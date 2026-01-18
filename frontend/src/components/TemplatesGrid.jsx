import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { TemplateCard } from './TemplateCard';
import { templates } from '../data/templates';
import { useRazorpay } from '../hooks/useRazorpay';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useDeviceCapabilities } from '../hooks/useDeviceCapabilities';

export const TemplatesGrid = ({ showAll = true }) => {
  const { initiatePayment } = useRazorpay();
  const [headerRef, isHeaderVisible] = useScrollAnimation(0.2);
  const [gridRef, isGridVisible] = useScrollAnimation(0.1);
  const { isFull, isMinimal } = useDeviceCapabilities();

  const displayTemplates = showAll ? templates : templates.slice(0, 8);

  const handleBuyNow = (template) => {
    initiatePayment(template);
  };

  // 3D card reveal animation variants
  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 40,
      rotateX: isMinimal ? 0 : 12,
      scale: 0.95,
    },
    visible: (index) => ({
      opacity: 1,
      y: 0,
      rotateX: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 80,
        damping: 15,
        delay: index * 0.06,
      },
    }),
  };

  return (
    <section id="products" className="w-full py-20 md:py-28 relative overflow-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/20 via-transparent to-secondary/30 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.12),_transparent_55%)] pointer-events-none" />
      <div className="absolute -top-24 right-[-10%] h-72 w-72 rounded-full bg-amber-400/20 blur-3xl animate-float pointer-events-none" />
      <div className="absolute bottom-0 left-[-10%] h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl animate-float-slow pointer-events-none" />

      <div className="container-slate relative z-10">
        {/* Pricing Context - Premium header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isHeaderVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 md:mb-16"
        >
          <div className="pb-8 border-b border-border/40">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={isHeaderVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-[0.26em] mb-4"
            >
              <Sparkles className="w-4 h-4" />
              Premium Collection
            </motion.span>

            <h2 id="workflows" className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              Premium{' '}
              <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 bg-clip-text text-transparent">
                Digital Assets
              </span>
            </h2>

            <p className="text-base sm:text-lg text-muted-foreground/90 leading-relaxed max-w-3xl">
              High-quality templates, workflows, and tools. One-time payment, lifetime access.
            </p>
          </div>
        </motion.div>

        {/* Responsive Grid with 3D perspective */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-7 lg:gap-8 xl:gap-10"
          style={{ perspective: isFull ? '2000px' : 'none' }}
        >
          {displayTemplates.map((template, index) => (
            <motion.div
              key={template.id}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              animate={isGridVisible ? 'visible' : 'hidden'}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <TemplateCard template={template} onBuyNow={handleBuyNow} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
