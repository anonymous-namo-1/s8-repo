import React from 'react';
import { Header } from '../components/Header';
import { Hero } from '../components/Hero';
import { TemplatesGrid } from '../components/TemplatesGrid';
import { TrustSection } from '../components/TrustSection';
import { WhySection } from '../components/WhySection';
import { Footer } from '../components/Footer';
import { Toaster } from 'sonner';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
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
