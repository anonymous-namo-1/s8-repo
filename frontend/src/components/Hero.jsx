import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';

export const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="w-full pt-32 pb-16 md:pt-40 md:pb-20">
      <div className="container-slate">
        <div className="max-w-4xl">
          {/* Target Audience Badge */}
          <p
            className={`text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4 transition-all duration-500 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: '100ms' }}
          >
            For developers, businesses, and automation enthusiasts
          </p>

          {/* Outcome-Driven Headline */}
          <h1
            className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-6 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            10,000+ automation workflows.
            <br />
            <span className="text-muted-foreground">Ready in minutes.</span>
          </h1>

          {/* Value Proposition - Remove Uncertainty */}
          <p
            className={`text-base sm:text-lg md:text-xl text-muted-foreground max-w-xl mb-4 leading-relaxed transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: '400ms' }}
          >
            Stop building from scratch. Import, customize, automate.
          </p>

          {/* What You Get */}
          <p
            className={`text-sm sm:text-base text-muted-foreground mb-8 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: '600ms' }}
          >
            Just ₹99. 10,000+ workflows. Lifetime access. 14-day money-back guarantee.
          </p>

          {/* CTAs */}
          <div
            className={`flex flex-wrap items-center gap-4 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: '800ms' }}
          >
            <Link to="/products">
              <Button variant="brutal" size="xl">
                Get All Workflows - ₹99
              </Button>
            </Link>
            <a
              href="#workflows-preview"
              className="text-sm font-medium opacity-60 hover:opacity-100 hover:text-gray-700 link-underline px-4 py-3 transition-colors duration-200"
            >
              Preview Workflows
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
