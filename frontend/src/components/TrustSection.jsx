import React from 'react';
import { Quote } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const testimonials = [
  {
    quote: "10,000+ workflows for ₹99? Absolute steal. Already automated 20+ tasks in my business.",
    role: "SaaS Founder"
  },
  {
    quote: "Saved me hundreds of hours. The n8n workflows work perfectly out of the box.",
    role: "Developer"
  },
  {
    quote: "Best automation investment I've made. Finally stopped building everything from scratch.",
    role: "Automation Enthusiast"
  }
];

export const TrustSection = () => {
  const [headerRef, isHeaderVisible] = useScrollAnimation(0.2);
  const [testimonialsRef, isTestimonialsVisible] = useScrollAnimation(0.1);
  const [techRef, isTechVisible] = useScrollAnimation(0.2);

  return (
    <section className="w-full py-16 md:py-20 border-t border-border">
      <div className="container-slate">
        {/* Header */}
        <div
          ref={headerRef}
          className={`text-center mb-12 transition-all duration-700 ${
            isHeaderVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
            Trusted by
          </p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-2">
            Used by developers, businesses, and automation enthusiasts
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            n8n, Zapier, Make — works with your favorite automation platforms
          </p>
        </div>

        {/* Testimonials */}
        <div
          ref={testimonialsRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
        >
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`p-4 sm:p-6 border border-border bg-secondary/30 transition-all duration-500 ${
                isTestimonialsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <Quote className="w-5 h-5 text-muted-foreground mb-4" />
              <p className="text-sm mb-4 leading-relaxed">
                {testimonial.quote}
              </p>
              <p className="text-xs text-muted-foreground">
                — {testimonial.role}
              </p>
            </div>
          ))}
        </div>

        {/* Tech Credibility */}
        <div
          ref={techRef}
          className={`flex flex-wrap justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-muted-foreground transition-all duration-700 ${
            isTechVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <span>Marketing Automation</span>
          <span className="opacity-30">|</span>
          <span>Sales Workflows</span>
          <span className="opacity-30">|</span>
          <span>HR & Operations</span>
          <span className="opacity-30">|</span>
          <span>Social Media</span>
          <span className="opacity-30">|</span>
          <span>DevOps & CI/CD</span>
        </div>
      </div>
    </section>
  );
};
