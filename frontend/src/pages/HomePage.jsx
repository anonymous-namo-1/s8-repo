import React from 'react';
import { Header } from '../components/Header';
import { Hero } from '../components/Hero';
import { TemplatesGrid } from '../components/TemplatesGrid';
import { TrustSection } from '../components/TrustSection';
import { WhySection } from '../components/WhySection';
import { Footer } from '../components/Footer';
import { SEO } from '../components/SEO';
import { Background3D } from '../components/Background3D';
import { Toaster } from 'sonner';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col relative">
      <Background3D />
      <SEO
        title="Syntheight - Automation Workflows & Premium Digital Assets"
        description="Discover 10,000+ automation workflows, templates, and tools for n8n, Zapier, and Make. One-time purchase, lifetime access."
        keywords="automation workflows, n8n templates, zapier workflows, make.com automation, digital assets, workflow templates"
        url="https://syntheight.com/"
        image="https://syntheight.com/images/workflow-product.png"
      />
      <Header />
      <main className="flex-1">
        <Hero />
        <TemplatesGrid />
        <TrustSection />
        <WhySection />
      </main>
      <Footer />
      <Toaster position="top-center" />
    </div>
  );
}
