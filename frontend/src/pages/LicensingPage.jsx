import React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Separator } from '../components/ui/separator';

export default function LicensingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-16 md:py-24">
        <div className="container-brutal">
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
              Licensing
            </h1>
            <p className="text-lg text-muted-foreground mb-12">
              Simple, straightforward licensing. No hidden fees.
            </p>
            
            {/* Standard License */}
            <div className="mb-12">
              <h2 className="text-xl font-semibold mb-4">Standard License</h2>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-foreground mt-2 flex-shrink-0" />
                  <span>Use on a single end product</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-foreground mt-2 flex-shrink-0" />
                  <span>End product can be free or commercial</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-foreground mt-2 flex-shrink-0" />
                  <span>Cannot be resold or redistributed</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-foreground mt-2 flex-shrink-0" />
                  <span>Cannot be used to create derivative products for sale</span>
                </li>
              </ul>
            </div>
            
            <Separator className="my-12" />
            
            {/* Extended License */}
            <div className="mb-12">
              <h2 className="text-xl font-semibold mb-4">Extended License</h2>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-foreground mt-2 flex-shrink-0" />
                  <span>Use on unlimited end products</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-foreground mt-2 flex-shrink-0" />
                  <span>Create products for clients</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-foreground mt-2 flex-shrink-0" />
                  <span>Use in SaaS applications</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-foreground mt-2 flex-shrink-0" />
                  <span>Cannot be resold as-is or redistributed</span>
                </li>
              </ul>
            </div>
            
            <Separator className="my-12" />
            
            {/* FAQ */}
            <div>
              <h2 className="text-xl font-semibold mb-6">Common Questions</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Can I use this for client work?</h3>
                  <p className="text-sm text-muted-foreground">
                    Yes, with the Extended License. Standard License is for single use only.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Do I get updates?</h3>
                  <p className="text-sm text-muted-foreground">
                    Yes, all updates are free for the life of the product.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Can I get a refund?</h3>
                  <p className="text-sm text-muted-foreground">
                    Yes, within 14 days if the product does not meet your expectations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
