import React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { TemplatesGrid } from '../components/TemplatesGrid';
import { TrustSection } from '../components/TrustSection';
import { SEO } from '../components/SEO';
import { Background3D } from '../components/Background3D';
import { Toaster } from 'sonner';

export default function ProductsPage() {
  return (
    <div className="min-h-screen flex flex-col relative">
      <Background3D />
      <SEO
        title="Automation Workflows Library"
        description="Browse our full collection of automation workflows and premium templates for n8n, Zapier, and Make. Instant download, lifetime access."
        keywords="automation workflows, workflow library, n8n workflows, zapier templates, make.com automation, business automation"
        url="https://syntheight.com/workflows"
        image="https://syntheight.com/images/workflow-product.png"
      />
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
