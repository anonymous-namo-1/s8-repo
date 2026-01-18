import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Eye } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
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
      <Card className="group border border-border/70 bg-gradient-to-b from-background via-background to-secondary/60 overflow-hidden flex flex-col relative transition-all duration-500 hover:shadow-[0_24px_60px_rgba(15,23,42,0.12)] hover:border-border/90">
        {/* Subtle gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 via-transparent to-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10" />

        {/* Image - clickable to go to detail page */}
        <Link to={`/template/${template.slug}`} className="relative aspect-[16/10] overflow-hidden bg-secondary block">
          {template.badge && (
            <Badge className="absolute left-3 top-3 z-10 bg-foreground text-background text-[10px] font-semibold uppercase tracking-[0.18em] px-2.5 py-1">
              {template.badge}
            </Badge>
          )}
          <ImageWithSkeleton
            src={template.image}
            alt={template.name}
            className="transition-all duration-500 group-hover:scale-105 object-top"
            lazy={true}
          />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          {/* Hover overlay with preview hint */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
            <span className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/40 bg-white/90 backdrop-blur-sm text-sm font-medium opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-lg">
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
            {/* Price in INR - Enhanced styling */}
            <div className="flex flex-col items-start">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold tracking-tight">
                  {formatPrice(template.price)}
                </span>
                {template.originalPrice && (
                  <span className="text-xs text-muted-foreground/60 line-through">
                    {formatPrice(template.originalPrice)}
                  </span>
                )}
              </div>
              {template.discount && (
                <span className="text-xs text-green-600 font-semibold mt-0.5">
                  Save {template.discount}%
                </span>
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
                className="h-9 px-4 text-sm group/btn"
                onClick={() => onBuyNow && onBuyNow(template)}
              >
                <span>Buy Now</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-0 -ml-1 group-hover/btn:opacity-100 group-hover/btn:ml-0 transition-all duration-300" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
