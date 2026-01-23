import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import { Button } from './ui/button';
import { Background3D } from './Background3D';

export const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const backgroundRef = useRef(null);
  const sectionRef = useRef(null);
  
  const fullText = 'Templates, workflows, and tools. One-time purchase, lifetime access.';

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    
    let index = 0;
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setDisplayedText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 30);

    return () => clearInterval(timer);
  }, [isVisible]);

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
          <motion.div
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0 }}
            className="mb-8 pointer-events-auto flex justify-center"
          >
            <button
              className="group inline-flex items-center gap-2 text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors duration-300"
              onClick={(e) => {
                e.stopPropagation();
                handleClick(e);
              }}
            >
              <span className="flex items-center justify-center w-8 h-8 rounded-full border border-muted-foreground/20 group-hover:border-muted-foreground/40 transition-all duration-300">
                <Play className="w-3 h-3 ml-0.5" />
              </span>
              <span className="font-medium">Click here</span>
            </button>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6"
          >
            <span className="block">Premium Digital Assets.</span>
            <span className="block mt-2 text-muted-foreground/70">Ready To Use.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 1 } : {}}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto mb-8 leading-relaxed h-[3.5rem] sm:h-auto"
          >
            {displayedText}
            <span className="inline-block w-0.5 h-5 bg-blue-500/70 ml-0.5 animate-pulse" />
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
        </div>
      </div>
    </section>
  );
};
