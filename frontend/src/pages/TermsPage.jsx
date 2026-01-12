import React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Separator } from '../components/ui/separator';

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-24 pb-16">
        <div className="container-slate">
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Terms of Service
            </h1>
            <p className="text-sm text-muted-foreground mb-10">
              Last updated: {new Date().toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
            
            <div className="space-y-8 text-sm">
              <section>
                <h2 className="text-lg font-semibold mb-3">License</h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  When you purchase a template, you receive a license to use it according to the license type specified:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-foreground mt-2 flex-shrink-0" />
                    <strong>Standard License:</strong> Use on a single end product, free or commercial.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-foreground mt-2 flex-shrink-0" />
                    <strong>Extended License:</strong> Use on unlimited projects.
                  </li>
                </ul>
              </section>
              
              <Separator />
              
              <section>
                <h2 className="text-lg font-semibold mb-3">Restrictions</h2>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-foreground mt-2 flex-shrink-0" />
                    You cannot resell or redistribute templates as-is
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-foreground mt-2 flex-shrink-0" />
                    You cannot use templates to create derivative products for sale
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-foreground mt-2 flex-shrink-0" />
                    You cannot claim templates as your own original work
                  </li>
                </ul>
              </section>
              
              <Separator />
              
              <section>
                <h2 className="text-lg font-semibold mb-3">Payments</h2>
                <p className="text-muted-foreground leading-relaxed">
                  All payments are processed securely through Razorpay. Prices are in Indian Rupees (INR). All purchases are one-time payments with no recurring charges.
                </p>
              </section>
              
              <Separator />
              
              <section>
                <h2 className="text-lg font-semibold mb-3">Delivery</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Digital products are delivered instantly after successful payment. Download links are sent to your email and are valid for 30 days.
                </p>
              </section>
              
              <Separator />
              
              <section>
                <h2 className="text-lg font-semibold mb-3">Contact</h2>
                <p className="text-muted-foreground leading-relaxed">
                  For questions about these terms, contact us at syntheight@gmail.com
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
