import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="w-full border-t border-border">
      {/* Positioning Statement */}
      <div className="container-slate py-10 border-b border-border">
        <div className="max-w-md">
          <p className="text-lg font-semibold mb-2">
            Templates built for people who ship.
          </p>
          <p className="text-sm text-muted-foreground">
            Stop tweaking. Start launching. These templates are built by developers, 
            for developers who value their time.
          </p>
        </div>
      </div>
      
      {/* Quick FAQ */}
      <div className="container-slate py-8 border-b border-border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div>
            <h4 className="font-semibold mb-2">Refunds</h4>
            <p className="text-xs text-muted-foreground">
              14-day money-back guarantee. No questions asked if it does not work for you.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">License</h4>
            <p className="text-xs text-muted-foreground">
              Use on your own projects or client work. Just do not resell the template itself.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Support</h4>
            <p className="text-xs text-muted-foreground">
              Email support within 24 hours. We help with setup, not custom development.
            </p>
          </div>
        </div>
      </div>
      
      {/* Bottom Links */}
      <div className="container-slate py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          {/* Logo & Copyright */}
          <div>
            <Link to="/" className="text-base font-bold tracking-tight mb-1 block">
              SlateTemplates
            </Link>
            <p className="text-xs text-muted-foreground">
              {new Date().getFullYear()} SlateTemplates. All rights reserved.
            </p>
          </div>
          
          {/* Policy Links */}
          <nav className="flex flex-wrap gap-6">
            <Link 
              to="/products" 
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Products
            </Link>
            <Link 
              to="/privacy" 
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Privacy
            </Link>
            <Link 
              to="/terms" 
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Terms
            </Link>
            <Link 
              to="/refund" 
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Refunds
            </Link>
            <Link 
              to="/contact" 
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Contact
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
};
