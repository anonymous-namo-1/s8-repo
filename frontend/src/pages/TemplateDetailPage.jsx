import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Clock, ChevronLeft, ChevronRight, Play, Check, Shield, Zap } from 'lucide-react';
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
  // Initialize timer from localStorage or set new end time
  const [timeLeft, setTimeLeft] = useState(() => {
    const storageKey = `sale_timer_${slug}`;
    const storedEndTime = localStorage.getItem(storageKey);

    if (storedEndTime) {
      const remaining = Math.floor((parseInt(storedEndTime, 10) - Date.now()) / 1000);
      return remaining > 0 ? remaining : 0;
    } else {
      // Set new end time 30 minutes from now
      const endTime = Date.now() + 30 * 60 * 1000;
      localStorage.setItem(storageKey, endTime.toString());
      return 30 * 60;
    }
  });

  // Countdown timer for sale
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!template) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center pt-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Template not found</h1>
            <Link to="/workflows">
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
    <div className="min-h-screen flex flex-col bg-background">
      <SEO
        title={seoTitle}
        description={seoDescription}
        keywords={seoKeywords}
        image={`https://syntheight.com${template.image}`}
        url={`https://syntheight.com/template/${template.slug}`}
        type="product"
      />
      <Header />

      {/* Floating Sale Timer - Enhanced Premium styling */}
      {timeLeft > 0 && (
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="fixed left-4 bottom-24 z-40 flex items-center gap-3 rounded-2xl border border-white/40 bg-background/80 px-4 py-2.5 text-foreground shadow-[0_16px_40px_rgba(0,0,0,0.18)] backdrop-blur-md sm:left-6 sm:bottom-28"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-orange-400 text-white shadow-[0_6px_18px_rgba(234,88,12,0.45)]">
            <Clock className="h-4 w-4" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Flash Offer
            </span>
            <span className="text-sm font-semibold">
              Ends in{' '}
              <span className="ml-1 rounded-md bg-foreground px-2 py-0.5 text-xs font-bold tabular-nums text-background">
                {formatTime(timeLeft)}
              </span>
            </span>
          </div>
        </motion.div>
      )}

      <main className="flex-1 pt-16 sm:pt-14 pb-24 lg:pb-0 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/20 via-transparent to-secondary/30 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.12),_transparent_55%)] pointer-events-none" />
        <div className="absolute -top-24 right-[-8%] h-72 w-72 rounded-full bg-amber-400/15 blur-3xl animate-float pointer-events-none" />
        <div className="absolute bottom-0 left-[-8%] h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl animate-float-slow pointer-events-none" />
        {/* Back Link - Premium styling */}
        <div className="container-slate py-6 relative z-10">
          <Link
            to="/workflows"
            className="group inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
          >
            <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
            <span>Back to Products</span>
          </Link>
        </div>

        {/* Template Content */}
        <div className="container-slate pb-24 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Left - Image Gallery */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-5"
            >
              {/* Badge */}
              {template.badge && (
                <Badge
                  variant="secondary"
                  className="bg-foreground text-background text-xs font-semibold px-4 py-1.5 mb-3 rounded-full shadow-sm"
                >
                  {template.badge}
                </Badge>
              )}

              {/* Main Image with Navigation */}
              <div className="relative rounded-2xl border border-border/60 bg-secondary/60 overflow-hidden group shadow-[0_20px_60px_rgba(15,23,42,0.12)]">
                {/* Image - natural aspect ratio with hover zoom */}
                <img
                  src={allImages[currentImageIndex]}
                  alt={`${template.name} - Image ${currentImageIndex + 1}`}
                  className="w-full h-auto transition-transform duration-500 group-hover:scale-[1.02]"
                />

                {/* Navigation Arrows - Premium styling */}
                {hasMultipleImages && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-background/95 hover:bg-background border border-border flex items-center justify-center transition-all duration-300 hover:shadow-lg opacity-0 group-hover:opacity-100"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-background/95 hover:bg-background border border-border flex items-center justify-center transition-all duration-300 hover:shadow-lg opacity-0 group-hover:opacity-100"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Image Counter - Premium styling */}
                {hasMultipleImages && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-background/95 backdrop-blur-sm border border-border px-4 py-1.5 text-xs font-medium shadow-sm">
                    {currentImageIndex + 1} / {allImages.length}
                  </div>
                )}
              </div>

              {/* Thumbnail Strip - Enhanced */}
              {hasMultipleImages && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {allImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-xl border-2 overflow-hidden transition-all duration-300 shadow-sm ${
                        index === currentImageIndex
                          ? 'border-foreground shadow-[0_10px_20px_rgba(15,23,42,0.15)]'
                          : 'border-border hover:border-foreground/50 opacity-70 hover:opacity-100'
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

              {/* Video Tutorial - Premium card */}
              <div className="mt-8 p-6 rounded-2xl border border-border/60 bg-secondary/40 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center shadow-sm">
                    <Play className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">Video Tutorial</h3>
                    <p className="text-xs text-muted-foreground">Learn how to use this workflow</p>
                  </div>
                </div>
                <div className="relative w-full rounded-xl border border-border/60 bg-secondary overflow-hidden shadow-sm" style={{ paddingBottom: '56.25%' }}>
                  <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src="https://www.youtube.com/embed/N4BOqPjOYOY"
                    title="Product Tutorial"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              </div>
            </motion.div>

            {/* Right - Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {/* Header */}
              <div className="mb-6 rounded-2xl border border-border/60 bg-background/80 p-6 shadow-[0_16px_45px_rgba(15,23,42,0.08)]">
                <p className="text-xs text-muted-foreground uppercase tracking-[0.15em] mb-3">
                  {template.bestFor}
                </p>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
                  {template.name}
                </h1>
                <p className="text-base text-muted-foreground leading-relaxed">
                  {template.description}
                </p>
              </div>

              {/* Quick Stats - Premium pills */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border/60 bg-background/80 text-sm shadow-sm">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>{template.customizeTime} to customize</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border/60 bg-background/80 text-sm shadow-sm">
                  <Shield className="w-4 h-4 text-muted-foreground" />
                  <span>14-day guarantee</span>
                </div>
              </div>

              <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent my-6" />

              {/* Included - Premium list */}
              <div className="mb-6 rounded-2xl border border-border/60 bg-background/80 p-6 shadow-[0_16px_45px_rgba(15,23,42,0.08)]">
                <h2 className="text-base font-semibold mb-4">What You Get</h2>
                <ul className="space-y-3">
                  {template.includes.map((item, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <div className="w-5 h-5 rounded-full bg-foreground/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-foreground" />
                      </div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent my-6" />

              {/* Who This Is NOT For - Premium warning */}
              <div className="mb-6 p-5 rounded-2xl bg-secondary/50 border border-foreground/10 shadow-[0_14px_35px_rgba(15,23,42,0.08)]">
                <h2 className="text-sm font-semibold mb-2">Not For You If</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {template.notFor}
                </p>
              </div>

              {/* Tech Stack & File Formats - Premium grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div className="rounded-2xl border border-border/60 bg-background/80 p-5 shadow-[0_16px_45px_rgba(15,23,42,0.08)]">
                  <h2 className="text-sm font-semibold mb-3">Tech Stack</h2>
                  <div className="flex flex-wrap gap-2">
                    {template.techStack.map((tech, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-background border border-border text-foreground/80 text-xs px-3 py-1 rounded-full"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="rounded-2xl border border-border/60 bg-background/80 p-5 shadow-[0_16px_45px_rgba(15,23,42,0.08)]">
                  <h2 className="text-sm font-semibold mb-3">Files Included</h2>
                  <div className="flex flex-wrap gap-2">
                    {template.fileFormats.map((format, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-background border border-border text-foreground/80 text-xs px-3 py-1 rounded-full"
                      >
                        {format}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent my-6" />

              {/* What Happens After Purchase - Premium steps */}
              <div className="mb-6 rounded-2xl border border-border/60 bg-background/80 p-6 shadow-[0_16px_45px_rgba(15,23,42,0.08)]">
                <h2 className="text-base font-semibold mb-4">After Purchase</h2>
                <div className="space-y-4">
                  {[
                    'Instant download link via email',
                    'Unzip and open in any code editor',
                    'Email support if you get stuck'
                  ].map((step, index) => (
                    <div key={index} className="flex items-start gap-4 group">
                      <div className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center text-sm font-bold flex-shrink-0 transition-transform duration-300 group-hover:scale-110 shadow-sm">
                        {index + 1}
                      </div>
                      <p className="text-sm text-muted-foreground pt-1.5">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent my-6" />

              {/* Purchase Section - Premium CTA */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-background via-secondary/50 to-secondary/70 border border-border/70 shadow-[0_20px_60px_rgba(15,23,42,0.12)]">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">One-time purchase</p>
                    <div className="flex items-baseline gap-3">
                      <p className="text-3xl sm:text-4xl font-bold tracking-tight">{formatPrice(template.price)}</p>
                      {template.originalPrice && (
                        <div className="flex flex-col">
                          <span className="text-base text-muted-foreground line-through">
                            {formatPrice(template.originalPrice)}
                          </span>
                          <span className="text-sm text-green-600 font-semibold">
                            Save {template.discount}%
                          </span>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Limited time offer
                    </p>
                  </div>
                  <Button
                    variant="brutal"
                    size="lg"
                    onClick={handleBuyNow}
                    className="w-full sm:w-auto group"
                  >
                    <span>Buy Now</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                </div>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-6 mt-5 text-xs text-muted-foreground">
                <span className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Secure payment
                </span>
                <span className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Instant download
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Mobile Floating Purchase Bar - Premium styling */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 px-4 pb-[calc(env(safe-area-inset-bottom,0px)+10px)] pt-2.5"
      >
        <div className="mx-auto w-full max-w-md rounded-2xl border border-border/70 bg-gradient-to-r from-white via-white/95 to-white/90 px-3.5 py-2.5 shadow-[0_-10px_26px_rgba(15,23,42,0.12)] backdrop-blur-md">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-baseline gap-2">
                <p className="text-lg font-bold">{formatPrice(template.price)}</p>
                {template.originalPrice && (
                  <span className="text-xs text-muted-foreground line-through">
                    {formatPrice(template.originalPrice)}
                  </span>
                )}
              </div>
              {template.discount && (
                <span className="text-[11px] font-semibold text-emerald-600">
                  Save {template.discount}%
                </span>
              )}
            </div>
            <Button
              variant="premium"
              size="default"
              onClick={handleBuyNow}
              className="rounded-full px-5 h-10 group flex-shrink-0"
            >
              <span>Buy Now</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </motion.div>

      <Footer />
      <Toaster position="top-center" />
    </div>
  );
}
