import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';

export const Header = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${window.scrollY}px`;
    } else {
      const scrollY = document.body.style.top;
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
    };
  }, [mobileMenuOpen]);

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { label: 'Workflows', to: '/workflows', type: 'link' },
    { label: '3D Websites', to: '/3d-websites', type: 'link', badge: 'Coming Soon' },
    { label: 'Notion', to: '/notion', type: 'link', badge: 'Coming Soon' },
    { label: 'Contact', to: '/contact', type: 'link' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
          scrolled
            ? 'glass-header-premium border-b border-black/5 shadow-[0_4px_24px_rgba(0,0,0,0.08)]'
            : 'glass-header-light'
        }`}
      >
        <div className="container-slate h-16 sm:h-14 flex items-center justify-between">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="flex items-center"
          >
            <Link to="/" className="flex items-center group">
              <span className="text-xl sm:text-lg font-bold tracking-tight transition-all duration-300 group-hover:tracking-wide">
                <span className="text-foreground">Synth</span>
                <span className="text-muted-foreground">eight</span>
              </span>
            </Link>
          </motion.div>

          <nav className="hidden md:flex items-center gap-1">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className={`relative px-4 py-2 text-sm font-medium transition-colors duration-300 group ${
                  isActive(item.to) ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  {item.label}
                  {item.badge && (
                    <span className="text-[10px] px-2.5 py-1 bg-secondary text-muted-foreground font-medium rounded-full transition-all duration-300">
                      {item.badge}
                    </span>
                  )}
                </span>
                <span className={`absolute bottom-1 left-4 right-4 h-px bg-foreground transition-transform duration-300 origin-left ${
                  isActive(item.to) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                }`} />
              </Link>
            ))}
            <Link to="/login" className="ml-2">
              <Button variant="brutal" size="sm" className="group">
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
          </nav>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex items-center justify-center w-10 h-10 -mr-2 rounded-lg hover:bg-black/5 transition-colors duration-300"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden fixed inset-0 bg-black/50 z-[200]"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="md:hidden fixed inset-y-0 right-0 w-[300px] max-w-[85vw] glass-menu z-[201] flex flex-col"
            >
              <div className="flex items-center justify-between h-16 px-6 border-b border-white/15">
                <span className="text-lg font-bold">
                  <span className="text-foreground">Synth</span>
                  <span className="text-muted-foreground">eight</span>
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center w-10 h-10 -mr-2 rounded-lg hover:bg-white/10 transition-colors duration-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto py-4">
                {menuItems.map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + index * 0.05 }}
                  >
                    <Link
                      to={item.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between py-4 px-6 text-base font-medium transition-colors duration-300 ${
                        isActive(item.to) 
                          ? 'text-blue-600 bg-blue-500/10' 
                          : 'text-foreground hover:bg-white/10'
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        {item.label}
                        {item.badge && (
                          <span className="text-[10px] px-2.5 py-1 bg-secondary/80 text-muted-foreground font-medium rounded-full transition-all duration-300">
                            {item.badge}
                          </span>
                        )}
                      </span>
                      <ChevronRight className={`w-5 h-5 transition-colors duration-300 ${
                        isActive(item.to) ? 'text-blue-500' : 'text-foreground/40'
                      }`} />
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <div className="p-6 border-t border-white/15">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="brutal" className="w-full h-12 text-base font-semibold group">
                      <span>Sign In</span>
                      <ArrowRight className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
