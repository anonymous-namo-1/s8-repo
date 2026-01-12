import React from 'react';
import { TemplateCard } from './TemplateCard';
import { templates } from '../data/templates';
import { useRazorpay } from '../hooks/useRazorpay';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

export const TemplatesGrid = ({ showAll = true }) => {
  const { initiatePayment } = useRazorpay();
  const [headerRef, isHeaderVisible] = useScrollAnimation(0.2);
  const [gridRef, isGridVisible] = useScrollAnimation(0.1);

  const displayTemplates = showAll ? templates : templates.slice(0, 8);

  const handleBuyNow = (template) => {
    initiatePayment(template);
  };

  return (
    <section id="products" className="w-full py-12 md:py-16">
      <div className="container-slate">
        {/* Pricing Context - Anchoring */}
        <div
          ref={headerRef}
          className={`mb-8 md:mb-10 pb-6 md:pb-8 border-b border-border transition-all duration-700 ${
            isHeaderVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-3">
            All Templates
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base mb-4 leading-relaxed">
            One-time purchase. No subscriptions. No lock-in.
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {templates.length} templates from ₹1,499. Cheaper than 2 hours of developer time.
          </p>
        </div>

        {/* Responsive Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8"
        >
          {displayTemplates.map((template, index) => (
            <div
              key={template.id}
              className={`transition-all duration-500 ${
                isGridVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <TemplateCard template={template} onBuyNow={handleBuyNow} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
