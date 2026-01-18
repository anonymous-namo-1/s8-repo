import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  const { isFull } = useDeviceCapabilities();

  const handleMouseMove = (e) => {
    if (!isFull || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate rotation (max 8 degrees)
    const newRotateX = ((y - centerY) / centerY) * -8;
    const newRotateY = ((x - centerX) / centerX) * 8;

    setRotateX(newRotateX);
    setRotateY(newRotateY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
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
      <Card className="group border border-border bg-background overflow-hidden flex flex-col relative hover:shadow-lg transition-all duration-300">
      {/* Image - clickable to go to detail page */}
      <Link to={`/template/${template.slug}`} className="aspect-[16/10] overflow-hidden bg-secondary block">
        <ImageWithSkeleton
          src={template.image}
          alt={template.name}
          className="transition-transform duration-300 group-hover:scale-105 object-top"
          lazy={true}
        />
      </Link>

      {/* Content */}
      <CardContent className="p-4 sm:p-5 flex flex-col flex-1">
        <div className="flex-1">
          {/* Name - clickable */}
          <Link to={`/template/${template.slug}`}>
            <h3 className="text-base sm:text-lg font-semibold tracking-tight mb-1 line-clamp-2 hover:text-muted-foreground transition-colors">
              {template.name}
            </h3>
          </Link>

          {/* Best For Label */}
          <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
            <span className="font-medium">Best for:</span> {template.bestFor}
          </p>

          {/* Use Case - hidden on mobile to reduce clutter */}
          <p className="hidden sm:block text-xs text-muted-foreground mb-3 line-clamp-1 leading-relaxed">
            {template.useCase}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-border">
          {/* Price in INR */}
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold">
                {formatPrice(template.price)}
              </span>
              {template.originalPrice && (
                <span className="text-xs text-muted-foreground line-through">
                  {formatPrice(template.originalPrice)}
                </span>
              )}
            </div>
            {template.discount && (
              <span className="text-xs text-green-600 font-medium">
                Save {template.discount}%
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Link
              to={`/template/${template.slug}`}
              className="hidden sm:block text-xs text-muted-foreground hover:text-foreground link-underline transition-colors duration-200 py-2"
            >
              Preview
            </Link>
            <Button
              variant="brutal"
              size="sm"
              className="h-9 px-3 text-sm"
              onClick={() => onBuyNow && onBuyNow(template)}
            >
              Buy Now
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
    </motion.div>
  );
};
