import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { Background3D } from './Background3D';

export const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="w-full pt-32 pb-20 md:pt-44 md:pb-28 relative overflow-hidden">
      <Background3D />

      <div className="container-slate relative" style={{ zIndex: 2 }}>
        <div className="max-w-4xl">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6"
          >
            <span className="block">Premium digital assets.</span>
            <span className="block mt-2 text-muted-foreground/70">Ready to use.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-xl mb-8 leading-relaxed"
          >
            Templates, workflows, and tools. One-time purchase, lifetime access.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
          >
            <Link to="/workflows">
              <Button variant="brutal" size="xl" className="group relative z-10">
                <span>Browse Products</span>
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
            <a
              href="#products"
              className="group flex items-center gap-2 text-base sm:text-sm font-medium text-muted-foreground hover:text-foreground px-4 py-4 sm:py-3 transition-all duration-300 relative z-10"
            >
              <span className="relative">
                View All Products
                <span className="absolute bottom-0 left-0 w-0 h-px bg-foreground group-hover:w-full transition-all duration-300" />
              </span>
              <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
