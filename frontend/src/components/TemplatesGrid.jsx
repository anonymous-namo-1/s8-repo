import React from 'react';
import { motion } from 'framer-motion';
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
      y: 30,
      rotateX: isMinimal ? 0 : 15,
      scale: 0.95,
    },
    visible: (index) => ({
      opacity: 1,
      y: 0,
      rotateX: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
        delay: index * 0.08,
      },
    }),
  };

  return (
    <section id="products" className="w-full py-12 md:py-16">
      <div className="container-slate">
        {/* Pricing Context - Anchoring */}
        <div
          ref={headerRef}
          className={`mb-6 md:mb-10 pb-5 md:pb-8 border-b border-border transition-all duration-700 ${
            isHeaderVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 id="workflows" className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-2">
            Get All 10,000+ Workflows
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base mb-3 leading-relaxed">
            One-time payment. Lifetime access. No subscriptions.
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Just ₹99 for the entire collection. Cheaper than an hour of development time.
          </p>
        </div>

        {/* Responsive Grid with 3D perspective */}
        <div
          ref={gridRef}
          className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5 lg:gap-6"
          style={{ perspective: isFull ? '1500px' : 'none' }}
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
