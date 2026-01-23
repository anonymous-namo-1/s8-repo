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

  const faqItems = [
    { icon: Shield, title: 'Refunds', desc: '14-day money-back guarantee. No questions asked if it does not work for you.' },
    { icon: Mail, title: 'Support', desc: 'Email support within 24 hours. We help with setup, not custom development.' },
    { icon: Clock, title: 'Lifetime Access', desc: 'Pay once, access forever. All future updates and additions included.' },
  ];

  return (
    <footer className="w-full border-t border-border/50 relative">
      {/* Subtle glassmorphism background effect */}
      <div 
        className="absolute inset-0 pointer-events-none backdrop-blur-sm"
        style={{
          background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.01))'
        }}
      />
      
      {/* Main footer gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/15 to-secondary/30 pointer-events-none" />
      
      <div className="relative">
        {/* Positioning Statement - Premium styling */}
        <div className="container-slate py-10 sm:py-16 md:py-24 border-b border-border/40">
          <div className="max-w-2xl">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight mb-4 sm:mb-6 leading-snug">
              Workflows built for people who automate.
            </h3>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed mb-6 sm:mb-10">
              Stop building automations from scratch. 10,000+ ready-to-use workflows
              for developers and businesses who value their time.
            </p>
            <Link
              to="/products"
              className="group inline-flex items-center gap-2.5 px-6 py-3 text-sm font-semibold text-foreground hover:text-foreground transition-all duration-300 rounded-sm border border-border/50 hover:border-border/70 bg-foreground/5 hover:bg-foreground/10 hover:shadow-md active:scale-95"
            >
              <span>Explore all workflows</span>
              <ArrowRight className="w-4 h-4 transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:scale-110" />
            </Link>
          </div>
        </div>

        {/* Subtle gradient separator */}
        <div className="container-slate">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-border/40 to-transparent" />
        </div>

        {/* Quick FAQ - Premium glass cards */}
        <div className="container-slate py-8 sm:py-12 md:py-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {faqItems.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="group relative rounded-2xl border border-border/50 bg-gradient-to-br from-background via-background to-secondary/30 p-4 sm:p-6 transition-all duration-300 hover:border-border hover:shadow-[0_20px_50px_rgba(15,23,42,0.1)] hover:-translate-y-1"
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-foreground text-background rounded-xl shadow-md transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg flex-shrink-0">
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm sm:text-base tracking-tight mb-1 sm:mb-2">{item.title}</h4>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Subtle gradient separator */}
        <div className="container-slate">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-border/40 to-transparent" />
        </div>

        {/* Bottom Links - Premium minimal */}
        <div className="container-slate py-10 md:py-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 md:gap-6">
            {/* Logo & Copyright */}
            <div>
              <Link to="/" className="group inline-block mb-3">
                <span className="text-lg font-bold tracking-tight transition-all duration-300 group-hover:tracking-widest">
                  <span className="text-foreground">Synth</span>
                  <span className="text-muted-foreground">eight</span>
                </span>
              </Link>
              <p className="text-xs text-muted-foreground/50">
                {new Date().getFullYear()} Syntheight. All rights reserved.
              </p>
            </div>

            {/* Policy Links - Enhanced hover with smooth underline */}
            <nav className="flex flex-wrap gap-6 md:gap-8">
              {footerLinks.map((link) => (
                link.type === 'anchor' ? (
                  <a
                    key={link.label}
                    href={link.href}
                    className="group relative text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 font-medium"
                  >
                    {link.label}
                    <span className="absolute -bottom-1.5 left-0 w-0 h-0.5 bg-foreground group-hover:w-full transition-all duration-300 rounded-full" />
                  </a>
                ) : (
                  <Link
                    key={link.label}
                    to={link.to}
                    className="group relative text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 font-medium"
                  >
                    {link.label}
                    <span className="absolute -bottom-1.5 left-0 w-0 h-0.5 bg-foreground group-hover:w-full transition-all duration-300 rounded-full" />
                  </Link>
                )
              ))}
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
};
