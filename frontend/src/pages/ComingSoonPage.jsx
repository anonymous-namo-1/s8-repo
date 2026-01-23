import React from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/button';
import { SEO } from '../components/SEO';

import { ArrowLeft, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const categoryInfo = {
  '3d-websites': {
    title: '3D Websites',
    description: 'Premium 3D website templates and components. Stunning animations, interactive experiences, and modern designs.',
    icon: '🌐'
  },
  'notion': {
    title: 'Notion Templates',
    description: 'Professional Notion templates for productivity, project management, and personal organization.',
    icon: '📝'
  }
};

export default function ComingSoonPage() {
  const { category } = useParams();
  const location = useLocation();

  // Get category from URL path if not from params
  const pathCategory = location.pathname.replace('/', '');
  const activeCategory = category || pathCategory;

  const info = categoryInfo[activeCategory] || {
    title: 'Coming Soon',
    description: 'This product category is coming soon.',
    icon: '🚀'
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      
      <SEO
        title={`${info.title} - Coming Soon | Syntheight`}
        description={info.description}
        keywords={`${info.title.toLowerCase()}, coming soon, syntheight`}
        url={`https://syntheight.com${location.pathname}`}
      />
      <Header />
      <main className="flex-1 flex items-center justify-center pt-16 pb-16">
        <div className="container-slate">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-xl mx-auto text-center"
          >
            {/* Icon */}
            <div className="mb-8 flex justify-center">
              <div className="icon-container-lg text-4xl shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
                {info.icon}
              </div>
            </div>

            {/* Badge */}
            <div className="badge-premium text-muted-foreground mb-6">
              <Clock className="w-4 h-4" />
              Coming Soon
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              {info.title}
            </h1>

            {/* Description */}
            <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
              {info.description}
            </p>

            {/* Info box */}
            <div className="section-box text-left mb-8">
              <h2 className="text-base font-semibold mb-4">What to expect:</h2>
              <ul className="space-y-3">
                <li className="list-item-premium">Premium quality assets</li>
                <li className="list-item-premium">One-time purchase, lifetime access</li>
                <li className="list-item-premium">Regular updates and additions</li>
                <li className="list-item-premium">14-day money-back guarantee</li>
              </ul>
            </div>

            {/* CTA */}
            <p className="text-sm text-muted-foreground mb-6">
              In the meantime, check out our available products.
            </p>

            <Link to="/workflows">
              <Button variant="brutal" size="lg" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Browse Available Products
              </Button>
            </Link>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
