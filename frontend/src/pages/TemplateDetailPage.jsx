import React, { useState, useEffect, useRef } from 'react';
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
  const [showFloatingBar, setShowFloatingBar] = useState(false);
  const purchaseSectionRef = useRef(null);
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

  // Show floating bar when purchase section is scrolled out of view (mobile only)
  useEffect(() => {
    const handleScroll = () => {
      if (purchaseSectionRef.current) {
        const rect = purchaseSectionRef.current.getBoundingClientRect();
        // Show floating bar when purchase section is above the viewport
        setShowFloatingBar(rect.bottom < 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

      {/* Floating Sale Timer - Premium styling */}
      {timeLeft > 0 && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed top-16 sm:top-14 left-0 right-0 z-40 flex items-center justify-center gap-3 py-2.5 bg-foreground text-background shadow-[0_4px_20px_rgba(0,0,0,0.15)]"
        >
          <Clock className="w-4 h-4" />
          <p className="text-sm font-medium">
            Sale ends in{' '}
            <span className="font-bold tabular-nums bg-background/10 px-2.5 py-1 ml-1">
              {formatTime(timeLeft)}
            </span>
          </p>
        </motion.div>
      )}

      <main className={`flex-1 ${timeLeft > 0 ? 'pt-[104px] sm:pt-[96px]' : 'pt-16 sm:pt-14'}`}>
        {/* Back Link - Premium styling */}
        <div className="container-slate py-6">
          <Link
            to="/products"
            className="group inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
          >
            <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
            <span>Back to Products</span>
          </Link>
        </div>

        {/* Template Content */}
        <div className="container-slate pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
            {/* Left - Image Gallery */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              {/* Badge */}
              {template.badge && (
                <Badge
                  variant="secondary"
                  className="bg-foreground text-background text-xs font-semibold px-3 py-1.5 mb-3"
                >
                  {template.badge}
                </Badge>
              )}

              {/* Main Image with Navigation */}
              <div className="relative border border-border bg-secondary overflow-hidden group">
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
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 bg-background/95 hover:bg-background border border-border flex items-center justify-center transition-all duration-300 hover:shadow-lg opacity-0 group-hover:opacity-100"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 bg-background/95 hover:bg-background border border-border flex items-center justify-center transition-all duration-300 hover:shadow-lg opacity-0 group-hover:opacity-100"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Image Counter - Premium styling */}
                {hasMultipleImages && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/95 backdrop-blur-sm border border-border px-4 py-1.5 text-xs font-medium">
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
                      className={`flex-shrink-0 w-20 h-20 border-2 overflow-hidden transition-all duration-300 ${
                        index === currentImageIndex
                          ? 'border-foreground shadow-md'
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
              <div className="mt-8 p-6 border border-border bg-secondary/30">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-foreground text-background flex items-center justify-center">
                    <Play className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">Video Tutorial</h3>
                    <p className="text-xs text-muted-foreground">Learn how to use this workflow</p>
                  </div>
                </div>
                <div className="relative w-full border border-border bg-secondary overflow-hidden" style={{ paddingBottom: '56.25%' }}>
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
              <div className="mb-6">
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
                <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary text-sm">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>{template.customizeTime} to customize</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary text-sm">
                  <Shield className="w-4 h-4 text-muted-foreground" />
                  <span>14-day guarantee</span>
                </div>
              </div>

              <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent my-6" />

              {/* Included - Premium list */}
              <div className="mb-6">
                <h2 className="text-base font-semibold mb-4">What You Get</h2>
                <ul className="space-y-3">
                  {template.includes.map((item, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <div className="w-5 h-5 bg-foreground/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-foreground" />
                      </div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent my-6" />

              {/* Who This Is NOT For - Premium warning */}
              <div className="mb-6 p-5 bg-secondary/50 border-l-2 border-foreground/20">
                <h2 className="text-sm font-semibold mb-2">Not For You If</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {template.notFor}
                </p>
              </div>

              {/* Tech Stack & File Formats - Premium grid */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h2 className="text-sm font-semibold mb-3">Tech Stack</h2>
                  <div className="flex flex-wrap gap-2">
                    {template.techStack.map((tech, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-background border border-border text-foreground/80 text-xs px-2.5 py-1"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h2 className="text-sm font-semibold mb-3">Files Included</h2>
                  <div className="flex flex-wrap gap-2">
                    {template.fileFormats.map((format, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-background border border-border text-foreground/80 text-xs px-2.5 py-1"
                      >
                        {format}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent my-6" />

              {/* What Happens After Purchase - Premium steps */}
              <div className="mb-6">
                <h2 className="text-base font-semibold mb-4">After Purchase</h2>
                <div className="space-y-4">
                  {[
                    'Instant download link via email',
                    'Unzip and open in any code editor',
                    'Email support if you get stuck'
                  ].map((step, index) => (
                    <div key={index} className="flex items-start gap-4 group">
                      <div className="w-8 h-8 bg-foreground text-background flex items-center justify-center text-sm font-bold flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
                        {index + 1}
                      </div>
                      <p className="text-sm text-muted-foreground pt-1.5">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent my-6" />

              {/* Purchase Section - Premium CTA */}
              <div
                ref={purchaseSectionRef}
                className="p-6 bg-secondary border border-border"
              >
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
        animate={{ y: showFloatingBar ? 0 : 100 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-t border-border px-4 py-4 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]"
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-baseline gap-3">
            <p className="text-2xl font-bold">{formatPrice(template.price)}</p>
            {template.originalPrice && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(template.originalPrice)}
                </span>
                <span className="text-sm text-green-600 font-semibold">
                  {template.discount}% OFF
                </span>
              </div>
            )}
          </div>
          <Button
            variant="brutal"
            size="lg"
            onClick={handleBuyNow}
            className="flex-shrink-0 group"
          >
            <span>Buy Now</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </div>
      </motion.div>

      <Footer />
      <Toaster position="top-center" />
    </div>
  );
}
