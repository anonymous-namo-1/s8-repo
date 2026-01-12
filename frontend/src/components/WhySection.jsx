import React from 'react';
import { Check } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const features = [
  {
    title: "Clean, readable code",
    description: "No spaghetti. No mystery classes. Code you can actually understand."
  },
  {
    title: "Fast load times",
    description: "Under 100KB total. No frameworks dragging you down."
  },
  {
    title: "Easy customization",
    description: "Change colors, fonts, content. Ship same day."
  },
  {
    title: "Built for production",
    description: "These templates run real businesses. Not just demos."
  }
];

export const WhySection = () => {
  const [leftRef, isLeftVisible] = useScrollAnimation(0.2);
  const [rightRef, isRightVisible] = useScrollAnimation(0.2);

  return (
    <section className="w-full py-16 md:py-20 border-t border-border">
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
              Why SlateTemplates
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground mb-4 leading-relaxed">
              Templates that respect your time and your users.
            </p>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Every template is hand-coded. No page builders. No generated code.
              Just clean, maintainable HTML, CSS, and JavaScript.
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
