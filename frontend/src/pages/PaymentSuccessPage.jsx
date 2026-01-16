import React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/button';
import { CheckCircle, Download, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PaymentSuccessPage() {
  const downloadUrl = 'https://drive.google.com/drive/u/1/folders/1-y-_Ck_JAcWCSBdTf1pedORN3MQZ1uyR';

  const handleDownload = () => {
    window.open(downloadUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-24 pb-16">
        <div className="container-slate">
          <div className="max-w-xl mx-auto text-center">
            {/* Success Icon */}
            <div className="mb-8 flex justify-center">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
            </div>

            {/* Success Message */}
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Payment Successful!
            </h1>
            <p className="text-muted-foreground mb-8 text-lg">
              Thank you for your purchase. Your order has been confirmed and you can now download your files.
            </p>

            {/* Download Section */}
            <div className="bg-secondary p-8 mb-8">
              <h2 className="text-xl font-semibold mb-4">
                Your Download is Ready
              </h2>
              <p className="text-muted-foreground mb-6 text-sm">
                Click the button below to access your 10,000+ Automation Workflows. The files are hosted on Google Drive for fast and reliable downloads.
              </p>
              <Button
                variant="brutal"
                size="lg"
                className="w-full sm:w-auto gap-2"
                onClick={handleDownload}
              >
                <Download className="w-5 h-5" />
                Download Files
              </Button>
            </div>

            {/* Additional Info */}
            <div className="text-left bg-background border border-border p-6 mb-8">
              <h3 className="font-semibold mb-3">What's Included:</h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• 10,000+ ready-to-use automation workflows</li>
                <li>• Compatible with n8n, Make, Zapier & more</li>
                <li>• Lifetime access to all files</li>
                <li>• Free future updates</li>
              </ul>
            </div>

            {/* Support Note */}
            <p className="text-sm text-muted-foreground mb-8">
              Having trouble downloading? Contact us at{' '}
              <a href="mailto:syntheight@gmail.com" className="underline hover:text-foreground">
                syntheight@gmail.com
              </a>
            </p>

            {/* Back to Home */}
            <Link to="/">
              <Button variant="outline" size="lg" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
