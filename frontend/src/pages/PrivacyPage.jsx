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
                <h2 className="text-lg font-semibold mb-3">1. Introduction</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Syntheight India ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-lg font-semibold mb-3">2. Information We Collect</h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  <strong>Personal Information</strong>
                </p>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  We may collect the following personal information:
                </p>
                <ul className="space-y-2 text-muted-foreground mb-4">
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-foreground mt-2 flex-shrink-0" />
                    Name and email address
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-foreground mt-2 flex-shrink-0" />
                    Phone number
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-foreground mt-2 flex-shrink-0" />
                    Business name and address
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-foreground mt-2 flex-shrink-0" />
                    Payment information (processed securely through Razorpay)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-foreground mt-2 flex-shrink-0" />
                    Communication preferences
                  </li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  <strong>Automatically Collected Information</strong>
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-foreground mt-2 flex-shrink-0" />
                    IP address and browser type
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-foreground mt-2 flex-shrink-0" />
                    Device information
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-foreground mt-2 flex-shrink-0" />
                    Usage data and analytics
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-foreground mt-2 flex-shrink-0" />
                    Cookies and similar technologies
                  </li>
                </ul>
              </section>

              <Separator />

              <section>
                <h2 className="text-lg font-semibold mb-3">3. How We Use Your Information</h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  We use the collected information for:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-foreground mt-2 flex-shrink-0" />
                    Providing and maintaining our services
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-foreground mt-2 flex-shrink-0" />
                    Processing transactions and sending related information
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-foreground mt-2 flex-shrink-0" />
                    Sending promotional communications (with your consent)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-foreground mt-2 flex-shrink-0" />
                    Responding to your inquiries and support requests
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-foreground mt-2 flex-shrink-0" />
                    Improving our website and services
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-foreground mt-2 flex-shrink-0" />
                    Complying with legal obligations
                  </li>
                </ul>
              </section>

              <Separator />

              <section>
                <h2 className="text-lg font-semibold mb-3">4. Information Sharing</h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  We do not sell your personal information. We may share your information with:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-foreground mt-2 flex-shrink-0" />
                    <strong>Service Providers:</strong> Third-party vendors who assist in providing our services (e.g., Razorpay for payments)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-foreground mt-2 flex-shrink-0" />
                    <strong>Legal Requirements:</strong> When required by law or to protect our rights
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-foreground mt-2 flex-shrink-0" />
                    <strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets
                  </li>
                </ul>
              </section>

              <Separator />

              <section>
                <h2 className="text-lg font-semibold mb-3">5. Data Security</h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  We implement appropriate technical and organizational measures to protect your personal information, including:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-foreground mt-2 flex-shrink-0" />
                    SSL/TLS encryption for data transmission
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-foreground mt-2 flex-shrink-0" />
                    Secure payment processing through Razorpay
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-foreground mt-2 flex-shrink-0" />
                    Regular security assessments
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-foreground mt-2 flex-shrink-0" />
                    Access controls and authentication measures
                  </li>
                </ul>
              </section>

              <Separator />

              <section>
                <h2 className="text-lg font-semibold mb-3">6. Your Rights</h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  You have the right to:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-foreground mt-2 flex-shrink-0" />
                    Access your personal information
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-foreground mt-2 flex-shrink-0" />
                    Correct inaccurate data
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-foreground mt-2 flex-shrink-0" />
                    Request deletion of your data
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-foreground mt-2 flex-shrink-0" />
                    Opt-out of marketing communications
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-foreground mt-2 flex-shrink-0" />
                    Withdraw consent where applicable
                  </li>
                </ul>
              </section>

              <Separator />

              <section>
                <h2 className="text-lg font-semibold mb-3">7. Cookies</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We use cookies and similar tracking technologies to enhance your experience. You can control cookie preferences through your browser settings.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-lg font-semibold mb-3">8. Third-Party Links</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Our website may contain links to third-party websites. We are not responsible for the privacy practices of these external sites.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-lg font-semibold mb-3">9. Children's Privacy</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Our services are not intended for individuals under 18 years of age. We do not knowingly collect personal information from children.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-lg font-semibold mb-3">10. Changes to This Policy</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last Updated" date.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-lg font-semibold mb-3">11. Contact Us</h2>
                <p className="text-muted-foreground leading-relaxed">
                  If you have questions about this Privacy Policy, please contact us at{' '}
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
