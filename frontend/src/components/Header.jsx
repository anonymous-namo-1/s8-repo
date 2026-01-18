import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
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
  
  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled ? 'glass-header' : 'bg-transparent'
      }`}
    >
      <div className="container-slate h-16 flex items-center justify-between">
        {/* Logo - Left */}
        <Link to="/" className="flex items-center">
          <span className="text-xl sm:text-lg font-bold tracking-tight">Syntheight</span>
        </Link>

        {/* Hamburger Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex items-center justify-center w-12 h-12 sm:w-10 sm:h-10 -mr-2"
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileMenuOpen ? (
            <X className="w-7 h-7 sm:w-6 sm:h-6" />
          ) : (
            <Menu className="w-7 h-7 sm:w-6 sm:h-6" />
          )}
        </button>
      </div>

      {/* Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-16 z-40 bg-background border-t border-border">
          <nav className="container-slate py-6 flex flex-col gap-2">
            <a
              href="#workflows"
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg sm:text-base font-medium py-4 px-4 hover:bg-secondary transition-colors"
            >
              Workflows
            </a>
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg sm:text-base font-medium py-4 px-4 hover:bg-secondary transition-colors"
            >
              Features
            </a>
            <Link
              to="/contact"
              className={`text-lg sm:text-base font-medium py-4 px-4 hover:bg-secondary transition-colors ${
                isActive('/contact') ? 'bg-secondary' : ''
              }`}
            >
              Contact
            </Link>
            <Link
              to="/login"
              className="text-lg sm:text-base font-medium py-4 px-4 hover:bg-secondary transition-colors"
            >
              Sign in
            </Link>
            <div className="mt-4 px-4">
              <Link to="/products" className="block">
                <Button variant="brutal" className="w-full h-14 text-base sm:h-12">
                  Get All Workflows
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
