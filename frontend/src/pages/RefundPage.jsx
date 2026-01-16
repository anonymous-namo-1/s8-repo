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
              Cancellation & Refund Policy
            </h1>
            <p className="text-sm text-muted-foreground mb-10">
              Last updated: {new Date().toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>

            <div className="space-y-8 text-sm">
              <section>
                <h2 className="text-lg font-semibold mb-3">1. Overview</h2>
                <p className="text-muted-foreground leading-relaxed">
                  At Syntheight India, we strive to provide the best digital solutions for your business. This Cancellation and Refund Policy outlines the terms under which you may cancel your subscription and request a refund.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-lg font-semibold mb-3">2. Subscription Cancellation</h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  You may cancel your subscription at any time through your account dashboard or by contacting our support team. Upon cancellation:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-foreground mt-2 flex-shrink-0" />
                    Your subscription will remain active until the end of the current billing period
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-foreground mt-2 flex-shrink-0" />
                    You will not be charged for subsequent billing periods
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-foreground mt-2 flex-shrink-0" />
                    Access to premium features will be revoked at the end of your billing period
                  </li>
                </ul>
              </section>

              <Separator />

              <section>
                <h2 className="text-lg font-semibold mb-3">3. Refund Policy</h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  We offer refunds under the following conditions:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-foreground mt-2 flex-shrink-0" />
                    <strong>Within 7 days of payment:</strong> Full refund available if you are not satisfied with our services
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-foreground mt-2 flex-shrink-0" />
                    <strong>Technical issues:</strong> Full or partial refund if we are unable to resolve technical issues affecting your service
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-foreground mt-2 flex-shrink-0" />
                    <strong>Duplicate payments:</strong> Full refund for any accidental duplicate charges
                  </li>
                </ul>
              </section>

              <Separator />

              <section>
                <h2 className="text-lg font-semibold mb-3">4. How to Request a Refund</h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  To request a refund, please contact us at{' '}
                  <a href="mailto:syntheight@gmail.com" className="underline hover:text-foreground">
                    syntheight@gmail.com
                  </a>
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Please include your registered email address and order/transaction ID in your refund request.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-lg font-semibold mb-3">5. Refund Processing</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Once approved, refunds will be processed within 5-7 business days. The refund will be credited to the original payment method used during the purchase.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-lg font-semibold mb-3">6. Non-Refundable Items</h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  The following are not eligible for refunds:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-foreground mt-2 flex-shrink-0" />
                    Custom development work that has been completed
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-foreground mt-2 flex-shrink-0" />
                    Third-party integration fees
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-foreground mt-2 flex-shrink-0" />
                    Setup or onboarding fees (if applicable)
                  </li>
                </ul>
              </section>

              <Separator />

              <section>
                <h2 className="text-lg font-semibold mb-3">7. Contact Us</h2>
                <p className="text-muted-foreground leading-relaxed">
                  If you have any questions about our Cancellation and Refund Policy, please contact us at{' '}
                  <a href="mailto:syntheight@gmail.com" className="underline hover:text-foreground">
                    syntheight@gmail.com
                  </a>
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
