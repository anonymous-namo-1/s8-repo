import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithSkeleton } from './ui/image-with-skeleton';
import { formatPrice } from '../data/templates';

export const TemplateCard = ({ template, onBuyNow }) => {
  return (
    <Card className="group border border-border bg-background overflow-hidden flex flex-col relative hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
      {/* Badge */}
      {template.badge && (
        <div className="absolute top-3 left-3 z-10">
          <Badge
            variant="secondary"
            className="bg-foreground text-background text-[10px] sm:text-xs font-medium px-2 py-0.5"
          >
            {template.badge}
          </Badge>
        </div>
      )}

      {/* Image */}
      <div className="aspect-[16/10] overflow-hidden bg-secondary">
        <ImageWithSkeleton
          src={template.image}
          alt={template.name}
          className="transition-transform duration-300 group-hover:scale-105 object-top"
          lazy={true}
        />
      </div>

      {/* Content */}
      <CardContent className="p-4 sm:p-6 flex flex-col flex-1">
        <div className="flex-1">
          {/* Name */}
          <h3 className="text-base font-semibold tracking-tight mb-1">
            {template.name}
          </h3>

          {/* Best For Label */}
          <p className="text-xs sm:text-sm text-muted-foreground mb-2">
            <span className="font-medium">Best for:</span> {template.bestFor}
          </p>

          {/* Use Case */}
          <p className="text-xs text-muted-foreground mb-3 line-clamp-1 leading-relaxed">
            {template.useCase}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-border">
          {/* Price in INR */}
          <span className="text-base font-bold">
            {formatPrice(template.price)}
          </span>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Link
              to={`/template/${template.slug}`}
              className="text-xs text-muted-foreground hover:text-foreground hover:text-gray-700 link-underline transition-colors duration-200"
            >
              Preview
            </Link>
            <Button
              variant="brutal"
              size="sm"
              className="h-8 px-3 text-xs"
              onClick={() => onBuyNow && onBuyNow(template)}
            >
              Buy Now
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
