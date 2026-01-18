import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Mail, Shield, Clock } from 'lucide-react';

export const Footer = () => {
  const footerLinks = [
    { label: 'Workflows', href: '#workflows', type: 'anchor' },
    { label: 'Privacy', to: '/privacy', type: 'link' },
    { label: 'Terms', to: '/terms', type: 'link' },
    { label: 'Refunds', to: '/refund', type: 'link' },
    { label: 'Contact', to: '/contact', type: 'link' },
  ];

  return (
    <footer className="w-full border-t border-border bg-gradient-to-b from-transparent to-secondary/30">
      {/* Positioning Statement - Premium styling */}
      <div className="container-slate py-16 md:py-20 border-b border-border/50">
        <div className="max-w-2xl">
          <h3 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">
            Workflows built for people who automate.
          </h3>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-8">
            Stop building automations from scratch. 10,000+ ready-to-use workflows
            for developers and businesses who value their time.
          </p>
          <Link
            to="/products"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:text-foreground/80 transition-colors"
          >
            <span>Explore all workflows</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      {/* Quick FAQ - Enhanced cards */}
      <div className="container-slate py-12 md:py-16 border-b border-border/50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="group">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 flex items-center justify-center bg-foreground/5 group-hover:bg-foreground group-hover:text-background transition-all duration-300">
                <Shield className="w-5 h-5" />
              </div>
              <h4 className="font-semibold text-base">Refunds</h4>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed pl-[52px]">
              14-day money-back guarantee. No questions asked if it does not work for you.
            </p>
          </div>
          <div className="group">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 flex items-center justify-center bg-foreground/5 group-hover:bg-foreground group-hover:text-background transition-all duration-300">
                <Mail className="w-5 h-5" />
              </div>
              <h4 className="font-semibold text-base">Support</h4>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed pl-[52px]">
              Email support within 24 hours. We help with setup, not custom development.
            </p>
          </div>
          <div className="group">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 flex items-center justify-center bg-foreground/5 group-hover:bg-foreground group-hover:text-background transition-all duration-300">
                <Clock className="w-5 h-5" />
              </div>
              <h4 className="font-semibold text-base">Lifetime Access</h4>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed pl-[52px]">
              Pay once, access forever. All future updates and additions included.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Links - Premium minimal */}
      <div className="container-slate py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          {/* Logo & Copyright */}
          <div>
            <Link to="/" className="group inline-block mb-2">
              <span className="text-lg font-bold tracking-tight transition-all duration-300 group-hover:tracking-wide">
                Syntheight
              </span>
            </Link>
            <p className="text-xs text-muted-foreground/60">
              {new Date().getFullYear()} Syntheight. All rights reserved.
            </p>
          </div>

          {/* Policy Links - Enhanced hover */}
          <nav className="flex flex-wrap gap-8">
            {footerLinks.map((link) => (
              link.type === 'anchor' ? (
                <a
                  key={link.label}
                  href={link.href}
                  className="group relative text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-foreground group-hover:w-full transition-all duration-300" />
                </a>
              ) : (
                <Link
                  key={link.label}
                  to={link.to}
                  className="group relative text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-foreground group-hover:w-full transition-all duration-300" />
                </Link>
              )
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
};
