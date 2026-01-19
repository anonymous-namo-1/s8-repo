import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';
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

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
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
        {/* Logo - Left */}
        <Link to="/" className="flex items-center group">
          <span className="text-xl sm:text-lg font-bold tracking-tight transition-all duration-300 group-hover:tracking-wide">
            <span className="text-foreground">Synth</span>
            <span className="text-muted-foreground">eight</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
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

        {/* Hamburger Menu Button - Mobile */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden flex items-center justify-center w-12 h-12 sm:w-10 sm:h-10 -mr-2 relative rounded-full"
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          <motion.div
            animate={{ rotate: mobileMenuOpen ? 180 : 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </motion.div>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden fixed inset-0 top-16 sm:top-14 bg-black/20 backdrop-blur-sm z-[55]"
              onClick={() => setMobileMenuOpen(false)}
            />
            {/* Menu panel */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="md:hidden absolute top-16 sm:top-14 right-4 z-[60] w-64 bg-white border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.12)] overflow-hidden"
            >
              <nav className="py-2 flex flex-col">
                {menuItems.map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      to={item.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between text-sm font-medium py-3.5 px-5 hover:bg-gray-50 transition-colors duration-200 group ${
                        isActive(item.to) ? 'bg-gray-50 text-foreground' : ''
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        {item.label}
                        {item.badge && (
                          <span className="text-[10px] px-1.5 py-0.5 bg-secondary text-muted-foreground font-medium">
                            {item.badge}
                          </span>
                        )}
                      </span>
                      <ArrowRight className={`w-4 h-4 transition-all duration-200 ${
                        isActive(item.to) ? 'opacity-50' : 'opacity-0 -translate-x-2 group-hover:opacity-50 group-hover:translate-x-0'
                      }`} />
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mt-2 mx-4 mb-3"
                >
                  <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-4" />
                  <Link to="/login" className="block" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="brutal" className="w-full h-11 text-sm group">
                      <span>Sign In</span>
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
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
