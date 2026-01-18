import React from 'react';
import { motion } from 'framer-motion';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const categories = [
  "Automation Workflows",
  "3D Websites",
  "Notion Templates",
  "Marketing Tools",
  "Developer Resources"
];

export const TrustSection = () => {
  const [headerRef, isHeaderVisible] = useScrollAnimation(0.2);
  const [techRef, isTechVisible] = useScrollAnimation(0.2);

  return (
    <section className="w-full py-20 md:py-28 border-t border-border relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/30 via-transparent to-secondary/30 pointer-events-none" />

      <div className="container-slate relative z-10">
        {/* Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={isHeaderVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isHeaderVisible ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-block text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em] mb-4 px-4 py-2 border border-border/50 bg-background"
          >
            Product Categories
          </motion.span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Premium Digital Assets
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            High-quality templates, tools, and resources for creators, developers, and business owners
          </p>
        </motion.div>

        {/* Categories */}
        <motion.div
          ref={techRef}
          initial={{ opacity: 0, y: 10 }}
          animate={isTechVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <p className="text-xs text-muted-foreground/60 uppercase tracking-wider mb-6">
            Browse by category
          </p>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            {categories.map((category, index) => (
              <motion.span
                key={category}
                initial={{ opacity: 0, y: 10 }}
                animate={isTechVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="px-4 py-2 text-xs sm:text-sm text-muted-foreground border border-border/50 bg-background hover:border-foreground/20 hover:bg-secondary/50 transition-all duration-300 cursor-default"
              >
                {category}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
