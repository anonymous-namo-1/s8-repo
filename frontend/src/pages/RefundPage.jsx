import React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Separator } from '../components/ui/separator';

export default function RefundPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-24 pb-16">
        <div className="container-slate">
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Refund Policy
            </h1>
            <p className="text-sm text-muted-foreground mb-10">
              Last updated: {new Date().toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
            
            <div className="space-y-8 text-sm">
              <section>
                <h2 className="text-lg font-semibold mb-3">14-Day Refund Window</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We offer a 14-day refund policy on all purchases. If the product does not meet your expectations, you can request a full refund within 14 days of purchase.
                </p>
              </section>
              
              <Separator />
              
              <section>
                <h2 className="text-lg font-semibold mb-3">How to Request a Refund</h2>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-foreground mt-2 flex-shrink-0" />
                    Email us at syntheight@gmail.com
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-foreground mt-2 flex-shrink-0" />
                    Include your order ID and the reason for the refund
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-foreground mt-2 flex-shrink-0" />
                    We will process your refund within 5-7 business days
                  </li>
                </ul>
              </section>
              
              <Separator />
              
              <section>
                <h2 className="text-lg font-semibold mb-3">Refund Conditions</h2>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-foreground mt-2 flex-shrink-0" />
                    Request must be made within 14 days of purchase
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-foreground mt-2 flex-shrink-0" />
                    Product must not have been used in a live project
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-foreground mt-2 flex-shrink-0" />
                    We may ask for feedback to improve our products
                  </li>
                </ul>
              </section>
              
              <Separator />
              
              <section>
                <h2 className="text-lg font-semibold mb-3">Refund Method</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Refunds are processed to the original payment method used during purchase. Razorpay will credit the amount back to your account.
                </p>
              </section>
              
              <Separator />
              
              <section>
                <h2 className="text-lg font-semibold mb-3">Contact</h2>
                <p className="text-muted-foreground leading-relaxed">
                  For refund requests or questions, contact us at syntheight@gmail.com
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
