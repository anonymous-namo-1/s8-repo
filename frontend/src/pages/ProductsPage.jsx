import React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { TemplatesGrid } from '../components/TemplatesGrid';
import { TrustSection } from '../components/TrustSection';
import { Toaster } from 'sonner';

export default function ProductsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-16">
        <TemplatesGrid showAll={true} />
        <TrustSection />
      </main>
      <Footer />
      <Toaster position="top-center" />
    </div>
  );
}
