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
    let isDeleting = false;
    
    const timer = setInterval(() => {
      if (!isDeleting) {
        if (index <= fullText.length) {
          setDisplayedText(fullText.slice(0, index));
          index++;
        } else {
          setTimeout(() => {
            isDeleting = true;
          }, 2000);
        }
      } else {
        if (index > 0) {
          index--;
          setDisplayedText(fullText.slice(0, index));
        } else {
          isDeleting = false;
        }
      }
    }, isDeleting ? 20 : 40);

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
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isVisible ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0 }}
            className="mb-10 pointer-events-auto flex justify-center"
          >
            <button
              className="group relative"
              onClick={(e) => {
                e.stopPropagation();
                handleClick(e);
              }}
            >
              <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-2xl scale-150" />
              <div className="absolute inset-[-4px] bg-gradient-to-r from-blue-500/20 via-cyan-400/20 to-blue-500/20 rounded-full blur-md" />
              
              <div className="relative flex items-center gap-3 px-6 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/30 shadow-[0_8px_32px_rgba(59,130,246,0.2),inset_0_1px_0_rgba(255,255,255,0.4)] transition-all duration-300 group-hover:bg-white/20 group-hover:border-white/50 group-hover:shadow-[0_8px_40px_rgba(59,130,246,0.4),inset_0_1px_0_rgba(255,255,255,0.5)]">
                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-black shadow-lg shadow-black/20 group-hover:shadow-black/40 transition-all duration-300">
                  <Play className="w-4 h-4 text-white ml-0.5" fill="white" />
                </span>
                <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900 transition-colors pr-1">Click here</span>
              </div>
            </button>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6"
          >
            <span className="block">Premium Digital Assets</span>
            <span className="block mt-2 text-muted-foreground/70">Ready To Use</span>
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
