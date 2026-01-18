import React, { useRef, useState } from 'react';
import { Quote, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useDeviceCapabilities } from '../hooks/useDeviceCapabilities';

const testimonials = [
  {
    quote: "10,000+ workflows for ₹99? Absolute steal. Already automated 20+ tasks in my business.",
    role: "SaaS Founder",
    highlight: "20+ tasks automated"
  },
  {
    quote: "Saved me hundreds of hours. The workflows work perfectly out of the box.",
    role: "Developer",
    highlight: "Hundreds of hours saved"
  },
  {
    quote: "Best automation investment I've made. Finally stopped building everything from scratch.",
    role: "Automation Enthusiast",
    highlight: "Best investment"
  }
];

const categories = [
  "Marketing Automation",
  "Sales Workflows",
  "HR & Operations",
  "Social Media",
  "DevOps & CI/CD"
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
      rotateX: ((y - centerY) / centerY) * -4,
      rotateY: ((x - centerX) / centerX) * 4,
      z: 15,
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
      initial={{ opacity: 0, y: 30 }}
      animate={isVisible ? {
        opacity: 1,
        y: 0,
        rotateX: transform.rotateX,
        rotateY: transform.rotateY,
        z: transform.z,
      } : { opacity: 0, y: 30 }}
      transition={{
        opacity: { duration: 0.6, delay: index * 0.15 },
        y: { duration: 0.6, delay: index * 0.15 },
        rotateX: { type: 'spring', stiffness: 200, damping: 20 },
        rotateY: { type: 'spring', stiffness: 200, damping: 20 },
        z: { type: 'spring', stiffness: 200, damping: 20 },
      }}
      style={{ transformStyle: 'preserve-3d' }}
      className="group relative p-6 sm:p-8 border border-border bg-background hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all duration-500"
    >
      {/* Premium accent line */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Quote icon with premium styling */}
      <div className="mb-5 flex items-center justify-between">
        <Quote className="w-8 h-8 text-foreground/10" />
        <div className="flex gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-3.5 h-3.5 fill-foreground/80 text-foreground/80" />
          ))}
        </div>
      </div>

      {/* Quote text with premium typography */}
      <p className="text-base sm:text-lg mb-5 leading-relaxed font-medium text-foreground/90">
        "{testimonial.quote}"
      </p>

      {/* Footer with role and highlight */}
      <div className="flex items-center justify-between pt-4 border-t border-border/50">
        <p className="text-sm text-muted-foreground font-medium">
          {testimonial.role}
        </p>
        <span className="text-xs text-foreground/50 bg-secondary px-2 py-1">
          {testimonial.highlight}
        </span>
      </div>
    </motion.div>
  );
};

export const TrustSection = () => {
  const [headerRef, isHeaderVisible] = useScrollAnimation(0.2);
  const [testimonialsRef, isTestimonialsVisible] = useScrollAnimation(0.1);
  const [techRef, isTechVisible] = useScrollAnimation(0.2);
  const { isFull } = useDeviceCapabilities();

  return (
    <section className="w-full py-20 md:py-28 border-t border-border relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/30 via-transparent to-secondary/30 pointer-events-none" />

      <div className="container-slate relative z-10">
        {/* Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={isHeaderVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isHeaderVisible ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-block text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em] mb-4 px-4 py-2 border border-border/50 bg-background"
          >
            Trusted by
          </motion.span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            What our customers say
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Join hundreds of developers, businesses, and automation enthusiasts who've transformed their workflows
          </p>
        </motion.div>

        {/* Testimonials with 3D hover */}
        <div
          ref={testimonialsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-16"
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

        {/* Tech Credibility - Enhanced */}
        <motion.div
          ref={techRef}
          initial={{ opacity: 0, y: 10 }}
          animate={isTechVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <p className="text-xs text-muted-foreground/60 uppercase tracking-wider mb-6">
            Workflows for every use case
          </p>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            {categories.map((category, index) => (
              <motion.span
                key={category}
                initial={{ opacity: 0, y: 10 }}
                animate={isTechVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="px-4 py-2 text-xs sm:text-sm text-muted-foreground border border-border/50 bg-background hover:border-foreground/20 hover:bg-secondary/50 transition-all duration-300 cursor-default"
              >
                {category}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
