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
              Terms & Conditions
            </h1>
            <p className="text-sm text-muted-foreground mb-10">
              Last updated: {new Date().toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>

            <div className="space-y-8 text-sm">
              <section>
                <h2 className="text-lg font-semibold mb-3">1. Acceptance of Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  By accessing and using the services provided by Syntheight India ("Company," "we," "our," or "us"), you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-lg font-semibold mb-3">2. Services Description</h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  Syntheight India provides website building and AI automation services for businesses. Our services include but are not limited to:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-foreground mt-2 flex-shrink-0" />
                    Custom website development
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-foreground mt-2 flex-shrink-0" />
                    AI and automation tools
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-foreground mt-2 flex-shrink-0" />
                    Digital marketing solutions
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-foreground mt-2 flex-shrink-0" />
                    Technical support and maintenance
                  </li>
                </ul>
              </section>

              <Separator />

              <section>
                <h2 className="text-lg font-semibold mb-3">3. Account Registration</h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  To use our services, you must create an account. You agree to:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-foreground mt-2 flex-shrink-0" />
                    Provide accurate and complete information
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-foreground mt-2 flex-shrink-0" />
                    Maintain the security of your account credentials
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-foreground mt-2 flex-shrink-0" />
                    Notify us immediately of any unauthorized access
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-foreground mt-2 flex-shrink-0" />
                    Be responsible for all activities under your account
                  </li>
                </ul>
              </section>

              <Separator />

              <section>
                <h2 className="text-lg font-semibold mb-3">4. Subscription Plans & Payment</h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  We offer various subscription plans with different features and pricing:
                </p>
                <ul className="space-y-2 text-muted-foreground mb-4">
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-foreground mt-2 flex-shrink-0" />
                    <strong>Basic Plan:</strong> Essential features for growing businesses
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-foreground mt-2 flex-shrink-0" />
                    <strong>Plus Plan:</strong> Premium features with priority support
                  </li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  Payment terms:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-foreground mt-2 flex-shrink-0" />
                    All prices are in Indian Rupees (INR)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-foreground mt-2 flex-shrink-0" />
                    Payments are processed securely through Razorpay
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-foreground mt-2 flex-shrink-0" />
                    Subscriptions auto-renew unless cancelled
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-foreground mt-2 flex-shrink-0" />
                    GST and applicable taxes are additional
                  </li>
                </ul>
              </section>

              <Separator />

              <section>
                <h2 className="text-lg font-semibold mb-3">5. User Responsibilities</h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  You agree not to:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-foreground mt-2 flex-shrink-0" />
                    Use our services for any unlawful purpose
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-foreground mt-2 flex-shrink-0" />
                    Upload malicious code or content
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-foreground mt-2 flex-shrink-0" />
                    Infringe on intellectual property rights
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-foreground mt-2 flex-shrink-0" />
                    Attempt to gain unauthorized access to our systems
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-foreground mt-2 flex-shrink-0" />
                    Resell or redistribute our services without permission
                  </li>
                </ul>
              </section>

              <Separator />

              <section>
                <h2 className="text-lg font-semibold mb-3">6. Intellectual Property</h2>
                <p className="text-muted-foreground leading-relaxed">
                  All content, trademarks, and intellectual property on our platform belong to Syntheight India unless otherwise stated. You retain ownership of content you create using our services.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-lg font-semibold mb-3">7. Service Availability</h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  We strive to maintain 99.9% uptime but do not guarantee uninterrupted service. We reserve the right to:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-foreground mt-2 flex-shrink-0" />
                    Perform scheduled maintenance
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-foreground mt-2 flex-shrink-0" />
                    Modify or discontinue features
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-foreground mt-2 flex-shrink-0" />
                    Suspend accounts for violations
                  </li>
                </ul>
              </section>

              <Separator />

              <section>
                <h2 className="text-lg font-semibold mb-3">8. Limitation of Liability</h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  To the maximum extent permitted by law, Syntheight India shall not be liable for:
                </p>
                <ul className="space-y-2 text-muted-foreground mb-4">
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-foreground mt-2 flex-shrink-0" />
                    Indirect, incidental, or consequential damages
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-foreground mt-2 flex-shrink-0" />
                    Loss of profits or data
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-foreground mt-2 flex-shrink-0" />
                    Service interruptions beyond our control
                  </li>
                </ul>
                <p className="text-muted-foreground leading-relaxed">
                  Our total liability shall not exceed the amount paid by you in the preceding 12 months.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-lg font-semibold mb-3">9. Indemnification</h2>
                <p className="text-muted-foreground leading-relaxed">
                  You agree to indemnify and hold harmless Syntheight India from any claims, damages, or expenses arising from your use of our services or violation of these terms.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-lg font-semibold mb-3">10. Termination</h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  Either party may terminate the service agreement at any time. Upon termination:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-foreground mt-2 flex-shrink-0" />
                    Your access to services will be revoked
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-foreground mt-2 flex-shrink-0" />
                    Outstanding payments remain due
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-foreground mt-2 flex-shrink-0" />
                    Data may be deleted after 30 days
                  </li>
                </ul>
              </section>

              <Separator />

              <section>
                <h2 className="text-lg font-semibold mb-3">11. Governing Law</h2>
                <p className="text-muted-foreground leading-relaxed">
                  These Terms shall be governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in India.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-lg font-semibold mb-3">12. Changes to Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We reserve the right to modify these Terms at any time. Continued use of our services after changes constitutes acceptance of the new terms.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-lg font-semibold mb-3">13. Contact Information</h2>
                <p className="text-muted-foreground leading-relaxed">
                  For questions about these Terms, contact us at{' '}
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
