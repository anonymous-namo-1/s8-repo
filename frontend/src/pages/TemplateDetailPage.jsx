import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { SEO } from '../components/SEO';
import { getTemplateBySlug, formatPrice } from '../data/templates';
import { useRazorpay } from '../hooks/useRazorpay';
import { Toaster } from 'sonner';

export default function TemplateDetailPage() {
  const { slug } = useParams();
  const template = getTemplateBySlug(slug);
  const { initiatePayment } = useRazorpay();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!template) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center pt-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Template not found</h1>
            <Link to="/products">
              <Button variant="brutal">Back to Products</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleBuyNow = () => {
    initiatePayment(template);
  };

  // Get all images - use images array if available, otherwise fall back to single image
  const allImages = template.images && template.images.length > 0
    ? template.images
    : [template.image];

  const hasMultipleImages = allImages.length > 1;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const seoTitle = `${template.name} - ${template.discount}% OFF`;
  const seoDescription = `${template.description} Only ${formatPrice(template.price)} (was ${formatPrice(template.originalPrice)}). ${template.includes.slice(0, 3).join('. ')}.`;
  const seoKeywords = [
    template.name.toLowerCase(),
    ...template.techStack.map(t => t.toLowerCase()),
    'automation workflows',
    'workflow templates',
    template.slug.replace(/-/g, ' ')
  ].join(', ');

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title={seoTitle}
        description={seoDescription}
        keywords={seoKeywords}
        image={`https://syntheight.com${template.image}`}
        url={`https://syntheight.com/template/${template.slug}`}
        type="product"
      />
      <Header />
      <main className="flex-1 pt-16">
        {/* Back Link */}
        <div className="container-slate py-6">
          <Link
            to="/products"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Products
          </Link>
        </div>

        {/* Template Content */}
        <div className="container-slate pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
            {/* Left - Image Gallery */}
            <div className="space-y-4">
              {/* Badge */}
              {template.badge && (
                <Badge
                  variant="secondary"
                  className="bg-foreground text-background text-xs font-medium px-2.5 py-1 mb-2"
                >
                  {template.badge}
                </Badge>
              )}

              {/* Main Image with Navigation */}
              <div className="relative border border-border bg-secondary">
                {/* Image - natural aspect ratio */}
                <img
                  src={allImages[currentImageIndex]}
                  alt={`${template.name} - Image ${currentImageIndex + 1}`}
                  className="w-full h-auto"
                />

                {/* Navigation Arrows */}
                {hasMultipleImages && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/90 hover:bg-background border border-border flex items-center justify-center transition-colors"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/90 hover:bg-background border border-border flex items-center justify-center transition-colors"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Image Counter */}
                {hasMultipleImages && (
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-background/90 border border-border px-3 py-1 text-xs font-medium">
                    {currentImageIndex + 1} / {allImages.length}
                  </div>
                )}
              </div>

              {/* Thumbnail Strip */}
              {hasMultipleImages && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {allImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 border-2 overflow-hidden transition-all ${
                        index === currentImageIndex
                          ? 'border-foreground'
                          : 'border-border hover:border-muted-foreground'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

            </div>

            {/* Right - Details */}
            <div>
              {/* Header */}
              <div className="mb-6">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                  {template.bestFor}
                </p>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">
                  {template.name}
                </h1>
                <p className="text-muted-foreground">
                  {template.description}
                </p>
              </div>

              {/* Quick Stats */}
              <div className="flex items-center gap-6 mb-6 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>{template.customizeTime} to customize</span>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Included */}
              <div className="mb-6">
                <h2 className="text-sm font-semibold mb-3">What You Get</h2>
                <ul className="space-y-1.5">
                  {template.includes.map((item, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="w-1 h-1 bg-foreground flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <Separator className="my-6" />

              {/* Who This Is NOT For */}
              <div className="mb-6 p-4 bg-secondary/50 border border-border">
                <h2 className="text-sm font-semibold mb-2">Not For You If</h2>
                <p className="text-xs text-muted-foreground">
                  {template.notFor}
                </p>
              </div>

              {/* Tech Stack & File Formats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <h2 className="text-sm font-semibold mb-2">Tech Stack</h2>
                  <div className="flex flex-wrap gap-1.5">
                    {template.techStack.map((tech, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-secondary text-secondary-foreground text-[10px] px-2 py-0.5"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h2 className="text-sm font-semibold mb-2">Files Included</h2>
                  <div className="flex flex-wrap gap-1.5">
                    {template.fileFormats.map((format, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-secondary text-secondary-foreground text-[10px] px-2 py-0.5"
                      >
                        {format}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              {/* What Happens After Purchase */}
              <div className="mb-6">
                <h2 className="text-sm font-semibold mb-3">After Purchase</h2>
                <div className="space-y-2">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-foreground text-background flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                      1
                    </div>
                    <div>
                      <p className="text-xs">Instant download link via email</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-foreground text-background flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                      2
                    </div>
                    <div>
                      <p className="text-xs">Unzip and open in any code editor</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-foreground text-background flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                      3
                    </div>
                    <div>
                      <p className="text-xs">Email support if you get stuck</p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Purchase Section */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-secondary">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">One-time purchase</p>
                  <div className="flex items-center gap-3">
                    <p className="text-2xl font-bold">{formatPrice(template.price)}</p>
                    {template.originalPrice && (
                      <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground line-through">
                          {formatPrice(template.originalPrice)}
                        </span>
                        <span className="text-xs text-green-600 font-medium">
                          Save {template.discount}%
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    Limited time offer • Cheaper than 1 hour of developer time
                  </p>
                </div>
                <Button
                  variant="brutal"
                  size="lg"
                  onClick={handleBuyNow}
                  className="w-full sm:w-auto"
                >
                  Buy Now
                </Button>
              </div>

              <p className="text-xs text-muted-foreground mt-3 text-center sm:text-left">
                Secure payment via Razorpay. Instant download.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <Toaster position="top-center" />
    </div>
  );
}
