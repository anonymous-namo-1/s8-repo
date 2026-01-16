import React from 'react';
import { Check } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const features = [
  {
    title: "10,000+ ready-to-use workflows",
    description: "Massive collection covering marketing, sales, HR, finance, DevOps, and more."
  },
  {
    title: "Easy to customize",
    description: "Modify workflows to fit your needs. Documentation included."
  },
  {
    title: "Lifetime access & updates",
    description: "One-time payment. Get all future workflow additions for free."
  }
];

export const WhySection = () => {
  const [leftRef, isLeftVisible] = useScrollAnimation(0.2);
  const [rightRef, isRightVisible] = useScrollAnimation(0.2);

  return (
    <section id="features" className="w-full py-16 md:py-20 border-t border-border">
      <div className="container-slate">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
          {/* Left - Title */}
          <div
            ref={leftRef}
            className={`transition-all duration-700 ${
              isLeftVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
            }`}
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-4">
              Why Syntheight
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground mb-4 leading-relaxed">
              Automation workflows that save you hundreds of hours.
            </p>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Stop building automations from scratch. Every workflow is ready to import,
              customize, and deploy. From simple tasks to complex multi-step integrations.
            </p>
          </div>

          {/* Right - Features */}
          <div
            ref={rightRef}
            className={`space-y-5 transition-all duration-700 ${
              isRightVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
            }`}
          >
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex gap-4 transition-all duration-500"
                style={{
                  transitionDelay: isRightVisible ? `${index * 100}ms` : '0ms'
                }}
              >
                <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center bg-foreground text-background mt-0.5">
                  <Check className="w-3 h-3" strokeWidth={3} />
                </div>
                <div>
                  <h3 className="font-semibold text-sm sm:text-base mb-0.5">{feature.title}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
