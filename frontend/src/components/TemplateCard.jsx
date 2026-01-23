import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Eye } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { ImageWithSkeleton } from './ui/image-with-skeleton';
import { formatPrice } from '../data/templates';
import { useDeviceCapabilities } from '../hooks/useDeviceCapabilities';

export const TemplateCard = ({ template, onBuyNow }) => {
  const cardRef = useRef(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const { isFull } = useDeviceCapabilities();

  const handleMouseMove = (e) => {
    if (!isFull || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate rotation (max 6 degrees for more subtle effect)
    const newRotateX = ((y - centerY) / centerY) * -6;
    const newRotateY = ((x - centerX) / centerX) * 6;

    setRotateX(newRotateX);
    setRotateY(newRotateY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
      animate={{
        rotateX: rotateX,
        rotateY: rotateY,
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30,
      }}
    >
      <Card className="group rounded-2xl border border-border/70 bg-gradient-to-b from-background via-background to-secondary/60 overflow-hidden flex flex-col relative transition-all duration-500 ring-1 ring-black/5 hover:shadow-[0_24px_80px_rgba(15,23,42,0.15)] hover:border-border/90">
        {/* Gradient border effect on hover */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-5" style={{
          background: 'linear-gradient(135deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.03) 100%)',
          padding: '1px',
          borderRadius: '1rem'
        }} />

        {/* Image - clickable to go to detail page */}
        <Link to={`/template/${template.slug}`} className="relative aspect-[4/3] overflow-hidden bg-secondary block">
          <div className="relative h-full overflow-hidden">
            <ImageWithSkeleton
              src={template.image}
              alt={template.name}
              className="transition-all duration-700 ease-out group-hover:scale-105 object-cover object-top"
              lazy={true}
            />
            {/* Shimmer effect on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
              animation: 'shimmer-shine 2s infinite',
            }} />
          </div>
          {/* Subtle overlay with preview hint - no blur */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center pointer-events-none">
            <span className="flex items-center gap-2 px-5 py-3 rounded-full border border-white/50 bg-white text-sm font-semibold opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.1)]">
              <Eye className="w-4 h-4" />
              View Details
            </span>
          </div>
        </Link>

        {/* Content */}
        <CardContent className="p-5 sm:p-6 flex flex-col flex-1 relative z-20">
          <div className="flex-1">
            {/* Name - clickable */}
            <Link to={`/template/${template.slug}`}>
              <h3 className="text-lg sm:text-xl font-semibold tracking-tight mb-2 line-clamp-2 group-hover:text-foreground/80 transition-colors duration-300">
                {template.name}
              </h3>
            </Link>

            {/* Best For Label - with premium styling */}
            <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
              <span className="font-medium text-foreground/70">Best for:</span> {template.bestFor}
            </p>

            {/* Use Case - hidden on mobile to reduce clutter */}
            <p className="hidden sm:block text-xs text-muted-foreground/80 mb-3 line-clamp-1 leading-relaxed">
              {template.useCase}
            </p>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
            {/* Price in INR - Improved visual hierarchy */}
            <div className="flex flex-col items-start gap-1">
              <div className="flex items-baseline gap-2.5">
                <span className="text-3xl font-black tracking-tighter bg-gradient-to-br from-foreground to-foreground/80 bg-clip-text text-transparent">
                  {formatPrice(template.price)}
                </span>
                {template.originalPrice && (
                  <span className="text-xs text-muted-foreground/50 line-through font-medium">
                    {formatPrice(template.originalPrice)}
                  </span>
                )}
              </div>
              {template.discount && (
                <motion.span 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="text-xs font-bold tracking-wide text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-1 rounded-full"
                >
                  Save {template.discount}%
                </motion.span>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Link
                to={`/template/${template.slug}`}
                className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors duration-200 py-2 group/preview"
              >
                <span className="relative">
                  Preview
                  <span className="absolute bottom-0 left-0 w-0 h-px bg-foreground group-hover/preview:w-full transition-all duration-300" />
                </span>
              </Link>
              <Button
                variant="brutal"
                size="sm"
                className="h-10 px-5 text-sm group/btn relative overflow-hidden transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,0,0,0.3)] hover:shadow-black/30"
                onClick={() => onBuyNow && onBuyNow(template)}
              >
                {/* Glow effect on hover */}
                <span className="absolute inset-0 rounded-md bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <span className="relative z-10">Download</span>
                <ArrowRight className="w-3.5 h-3.5 relative z-10 transition-transform duration-300 group-hover/btn:translate-x-1" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
