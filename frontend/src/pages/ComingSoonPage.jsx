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
    <div className="min-h-screen flex flex-col">
      <SEO
        title={`${info.title} - Coming Soon | Syntheight`}
        description={info.description}
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
              <div className="w-20 h-20 bg-secondary flex items-center justify-center text-4xl">
                {info.icon}
              </div>
            </div>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary border border-border text-sm font-medium text-muted-foreground mb-6">
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
            <div className="bg-secondary p-6 mb-8 text-left">
              <h2 className="text-base font-semibold mb-3">What to expect:</h2>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Premium quality assets</li>
                <li>• One-time purchase, lifetime access</li>
                <li>• Regular updates and additions</li>
                <li>• 14-day money-back guarantee</li>
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
