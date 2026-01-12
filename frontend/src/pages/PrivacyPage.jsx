import React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Separator } from '../components/ui/separator';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-24 pb-16">
        <div className="container-slate">
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Privacy Policy
            </h1>
            <p className="text-sm text-muted-foreground mb-10">
              Last updated: {new Date().toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
            
            <div className="space-y-8 text-sm">
              <section>
                <h2 className="text-lg font-semibold mb-3">Information We Collect</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We collect information you provide directly, such as your email address when making a purchase. We also collect payment information through our payment processor, Razorpay.
                </p>
              </section>
              
              <Separator />
              
              <section>
                <h2 className="text-lg font-semibold mb-3">How We Use Your Information</h2>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-foreground mt-2 flex-shrink-0" />
                    Process your purchases and deliver products
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-foreground mt-2 flex-shrink-0" />
                    Send purchase confirmations and download links
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-foreground mt-2 flex-shrink-0" />
                    Respond to support requests
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-foreground mt-2 flex-shrink-0" />
                    Improve our products and services
                  </li>
                </ul>
              </section>
              
              <Separator />
              
              <section>
                <h2 className="text-lg font-semibold mb-3">Data Security</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We use industry-standard security measures to protect your data. Payment information is processed securely by Razorpay and we do not store your card details.
                </p>
              </section>
              
              <Separator />
              
              <section>
                <h2 className="text-lg font-semibold mb-3">Contact</h2>
                <p className="text-muted-foreground leading-relaxed">
                  For privacy-related questions, contact us at hello@slatetemplates.com
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
