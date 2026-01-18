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
        scrolled ? 'glass-header shadow-sm' : 'bg-background/95 backdrop-blur-sm'
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

      {/* Menu Dropdown - Right aligned, solid background */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop to close menu when clicking outside */}
          <div
            className="fixed inset-0 top-16 z-[55]"
            onClick={() => setMobileMenuOpen(false)}
          />
          {/* Menu panel */}
          <div className="absolute top-16 right-4 z-[60] w-56 bg-white border border-gray-200 shadow-lg">
            <nav className="py-2 flex flex-col">
              <a
                href="#workflows"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium py-3 px-4 hover:bg-gray-100 transition-colors"
              >
                Workflows
              </a>
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium py-3 px-4 hover:bg-gray-100 transition-colors"
              >
                Features
              </a>
              <Link
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className={`text-sm font-medium py-3 px-4 hover:bg-gray-100 transition-colors ${
                  isActive('/contact') ? 'bg-gray-100' : ''
                }`}
              >
                Contact
              </Link>
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium py-3 px-4 hover:bg-gray-100 transition-colors"
              >
                Sign in
              </Link>
              <div className="mt-2 px-4 pb-2">
                <Link to="/products" className="block" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="brutal" className="w-full h-10 text-sm">
                    Get All Workflows
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        </>
      )}
    </header>
  );
};
