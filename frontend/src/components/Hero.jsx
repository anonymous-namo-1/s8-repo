import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from './ui/button';

export const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="w-full pt-32 pb-20 md:pt-44 md:pb-28 relative overflow-hidden">
      {/* Subtle gradient overlay for better text readability over 3D background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background/50 pointer-events-none" />

      <div className="container-slate relative z-10">
        <div className="max-w-4xl">
          {/* Target Audience Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-6"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/80 backdrop-blur-sm border border-border text-sm font-medium text-muted-foreground">
              <Sparkles className="w-4 h-4" />
              For creators, developers, and business owners
            </span>
          </motion.div>

          {/* Outcome-Driven Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-8"
          >
            <span className="block">Premium digital</span>
            <span className="block">assets.</span>
            <span className="block mt-2 text-muted-foreground/70">Ready to use.</span>
          </motion.h1>

          {/* Value Proposition - Remove Uncertainty */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-2xl mb-6 leading-relaxed font-light"
          >
            High-quality templates, workflows, and tools. One-time purchase, lifetime access.
          </motion.p>

          {/* What You Get - Premium styled */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-10 text-sm sm:text-base text-muted-foreground"
          >
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-foreground rounded-full" />
              Premium quality
            </span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-foreground rounded-full" />
              Instant download
            </span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-foreground rounded-full" />
              Lifetime access
            </span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-foreground rounded-full" />
              14-day guarantee
            </span>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
          >
            <Link to="/workflows">
              <Button variant="brutal" size="xl" className="group">
                <span>Browse Products</span>
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
            <a
              href="#products"
              className="group flex items-center gap-2 text-base sm:text-sm font-medium text-muted-foreground hover:text-foreground px-4 py-4 sm:py-3 transition-all duration-300"
            >
              <span className="relative">
                View All Products
                <span className="absolute bottom-0 left-0 w-0 h-px bg-foreground group-hover:w-full transition-all duration-300" />
              </span>
              <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
            </a>
          </motion.div>

          {/* Social proof hint */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-10 text-xs text-muted-foreground/60"
          >
            Trusted by creators, developers, and businesses worldwide
          </motion.p>
        </div>
      </div>
    </section>
  );
};
