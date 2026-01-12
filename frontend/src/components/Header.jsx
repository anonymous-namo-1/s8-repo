import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';

export const Header = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
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
          <span className="text-lg font-bold tracking-tight">SlateTemplates</span>
        </Link>
        
        {/* Navigation - Center */}
        <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          <Link 
            to="/" 
            className={`text-sm font-medium link-underline ${
              isActive('/') ? 'opacity-100' : 'opacity-60 hover:opacity-100'
            }`}
          >
            Home
          </Link>
          <Link 
            to="/products" 
            className={`text-sm font-medium link-underline ${
              isActive('/products') ? 'opacity-100' : 'opacity-60 hover:opacity-100'
            }`}
          >
            Products
          </Link>
          <Link 
            to="/contact" 
            className={`text-sm font-medium link-underline ${
              isActive('/contact') ? 'opacity-100' : 'opacity-60 hover:opacity-100'
            }`}
          >
            Contact
          </Link>
        </nav>
        
        {/* Right Actions */}
        <div className="flex items-center gap-6">
          <Link 
            to="/login" 
            className="text-sm font-medium opacity-60 hover:opacity-100 hidden sm:block"
          >
            Login
          </Link>
          <Button variant="brutal-outline" className="h-11 px-6">
            Get Started
          </Button>
        </div>
      </div>
    </header>
  );
};
