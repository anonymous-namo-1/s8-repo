import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import { Button } from './ui/button';
import { Background3D } from './Background3D';

export const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const backgroundRef = useRef(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleClick = useCallback((e) => {
    if (backgroundRef.current && sectionRef.current) {
      const rect = sectionRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      backgroundRef.current.triggerWave(x, y);
    }
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="w-full pt-32 pb-20 md:pt-44 md:pb-28 relative overflow-hidden cursor-pointer"
      onClick={handleClick}
    >
      <Background3D ref={backgroundRef} />

      <div className="container-slate relative pointer-events-none" style={{ zIndex: 2 }}>
        <div className="max-w-4xl mx-auto text-center">
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
            className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto mb-8 leading-relaxed"
          >
            Templates, workflows, and tools. One-time purchase, lifetime access.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pointer-events-auto"
          >
            <Link to="/workflows">
              <Button variant="brutal" size="xl" className="group relative z-10">
                <span>Browse Products</span>
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link
              to="/contact"
              className="group flex items-center gap-2 text-base sm:text-sm font-medium text-muted-foreground hover:text-foreground px-4 py-4 sm:py-3 transition-all duration-300 relative z-10"
            >
              <span className="relative">
                Contact Us
                <span className="absolute bottom-0 left-0 w-0 h-px bg-foreground group-hover:w-full transition-all duration-300" />
              </span>
              <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-10 pointer-events-auto"
          >
            <button
              className="group inline-flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
              onClick={(e) => {
                e.stopPropagation();
                handleClick(e);
              }}
            >
              <span className="flex items-center justify-center w-12 h-12 rounded-full border border-muted-foreground/30 group-hover:border-foreground/50 group-hover:bg-foreground/5 transition-all duration-300">
                <Play className="w-5 h-5 ml-0.5" />
              </span>
              <span className="font-medium">Click here</span>
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
