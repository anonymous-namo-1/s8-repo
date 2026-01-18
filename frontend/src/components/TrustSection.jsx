import React, { useRef, useState } from 'react';
import { Quote } from 'lucide-react';
import { motion } from 'framer-motion';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useDeviceCapabilities } from '../hooks/useDeviceCapabilities';

const testimonials = [
  {
    quote: "10,000+ workflows for ₹99? Absolute steal. Already automated 20+ tasks in my business.",
    role: "SaaS Founder"
  },
  {
    quote: "Saved me hundreds of hours. The workflows work perfectly out of the box.",
    role: "Developer"
  },
  {
    quote: "Best automation investment I've made. Finally stopped building everything from scratch.",
    role: "Automation Enthusiast"
  }
];

const TestimonialCard = ({ testimonial, index, isVisible, isFull }) => {
  const cardRef = useRef(null);
  const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0, z: 0 });

  const handleMouseMove = (e) => {
    if (!isFull || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    setTransform({
      rotateX: ((y - centerY) / centerY) * -5,
      rotateY: ((x - centerX) / centerX) * 5,
      z: 20,
    });
  };

  const handleMouseLeave = () => {
    setTransform({ rotateX: 0, rotateY: 0, z: 0 });
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 30, rotateX: 10 }}
      animate={isVisible ? {
        opacity: 1,
        y: 0,
        rotateX: transform.rotateX,
        rotateY: transform.rotateY,
        z: transform.z,
      } : { opacity: 0, y: 30, rotateX: 10 }}
      transition={{
        opacity: { duration: 0.5, delay: index * 0.15 },
        y: { duration: 0.5, delay: index * 0.15 },
        rotateX: { type: 'spring', stiffness: 200, damping: 20 },
        rotateY: { type: 'spring', stiffness: 200, damping: 20 },
        z: { type: 'spring', stiffness: 200, damping: 20 },
      }}
      style={{ transformStyle: 'preserve-3d' }}
      className="p-4 sm:p-6 border border-border bg-secondary/30 hover:shadow-lg transition-shadow duration-300"
    >
      <Quote className="w-5 h-5 text-muted-foreground mb-4" />
      <p className="text-sm mb-4 leading-relaxed">
        {testimonial.quote}
      </p>
      <p className="text-xs text-muted-foreground">
        — {testimonial.role}
      </p>
    </motion.div>
  );
};

export const TrustSection = () => {
  const [headerRef, isHeaderVisible] = useScrollAnimation(0.2);
  const [testimonialsRef, isTestimonialsVisible] = useScrollAnimation(0.1);
  const [techRef, isTechVisible] = useScrollAnimation(0.2);
  const { isFull } = useDeviceCapabilities();

  return (
    <section className="w-full py-16 md:py-20 border-t border-border">
      <div className="container-slate">
        {/* Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={isHeaderVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
            Trusted by
          </p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-2">
            Used by developers, businesses, and automation enthusiasts
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Join hundreds of satisfied customers
          </p>
        </motion.div>

        {/* Testimonials with 3D hover */}
        <div
          ref={testimonialsRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
          style={{ perspective: isFull ? '1000px' : 'none' }}
        >
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              testimonial={testimonial}
              index={index}
              isVisible={isTestimonialsVisible}
              isFull={isFull}
            />
          ))}
        </div>

        {/* Tech Credibility */}
        <motion.div
          ref={techRef}
          initial={{ opacity: 0, y: 10 }}
          animate={isTechVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-muted-foreground"
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
        </motion.div>
      </div>
    </section>
  );
};
