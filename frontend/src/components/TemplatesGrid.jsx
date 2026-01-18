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
    <section id="products" className="w-full py-16 md:py-24 relative">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/20 via-transparent to-secondary/20 pointer-events-none" />

      <div className="container-slate relative z-10">
        {/* Pricing Context - Premium header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isHeaderVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-10 md:mb-14"
        >
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-8 border-b border-border/50">
            <div>
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={isHeaderVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em] mb-4"
              >
                <Sparkles className="w-4 h-4" />
                Premium Collection
              </motion.span>

              <h2 id="workflows" className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
                Get All 10,000+ Workflows
              </h2>

              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl">
                One-time payment. Lifetime access. No subscriptions.
              </p>
            </div>

            {/* Price highlight */}
            <div className="flex-shrink-0 p-6 bg-foreground text-background">
              <p className="text-xs uppercase tracking-wider mb-1 opacity-70">Complete Collection</p>
              <p className="text-3xl sm:text-4xl font-bold tracking-tight">₹99</p>
              <p className="text-xs mt-1 opacity-70">One-time payment</p>
            </div>
          </div>
        </motion.div>

        {/* Responsive Grid with 3D perspective */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6 lg:gap-8"
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
