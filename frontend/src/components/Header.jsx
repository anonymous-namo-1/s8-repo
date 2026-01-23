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
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
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
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'glass-header shadow-[0_1px_20px_rgba(0,0,0,0.06)]'
          : 'bg-background/80 backdrop-blur-md'
      }`}
    >
      <div className="container-slate h-16 sm:h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center group">
          <span className="text-xl sm:text-lg font-bold tracking-tight transition-all duration-300 group-hover:tracking-wide">
            <span className="text-foreground">Synth</span>
            <span className="text-muted-foreground">eight</span>
          </span>
        </Link>

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
                  <span className="text-[10px] px-1.5 py-0.5 bg-secondary text-muted-foreground font-medium">
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
          className="md:hidden flex items-center justify-center w-10 h-10 -mr-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          <motion.div
            animate={{ rotate: mobileMenuOpen ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </motion.div>
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden fixed inset-0 top-16 bg-black/30 backdrop-blur-sm z-[55]"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
              className="md:hidden fixed top-16 right-0 bottom-0 z-[60] w-full max-w-xs bg-white shadow-2xl"
            >
              <nav className="flex flex-col h-full">
                <div className="flex-1 overflow-y-auto py-4">
                  {menuItems.map((item, index) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 + 0.1 }}
                    >
                      <Link
                        to={item.to}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center justify-between py-4 px-6 text-base font-medium transition-colors ${
                          isActive(item.to) 
                            ? 'bg-gray-50 text-foreground' 
                            : 'text-gray-600 hover:bg-gray-50 hover:text-foreground'
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          {item.label}
                          {item.badge && (
                            <span className="text-[10px] px-2 py-1 bg-gray-100 text-gray-500 font-medium rounded-full">
                              {item.badge}
                            </span>
                          )}
                        </span>
                        <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${
                          isActive(item.to) ? 'translate-x-0' : '-translate-x-1 group-hover:translate-x-0'
                        }`} />
                      </Link>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="p-4 border-t border-gray-100"
                >
                  <Link to="/login" className="block" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="brutal" className="w-full h-12 text-base group">
                      <span>Sign In</span>
                      <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </motion.div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};
