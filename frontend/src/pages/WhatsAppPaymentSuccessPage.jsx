import React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/button';
import { CheckCircle, Download, ArrowLeft, BookOpen, Sparkles, HelpCircle, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { motion } from 'framer-motion';

export default function WhatsAppPaymentSuccessPage() {
  const downloadUrl = 'https://drive.google.com/drive/u/1/folders/1YpeUgwiNT9MingxS4sBEwVUbBQG7HuI-';

  const handleDownload = () => {
    window.open(downloadUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen flex flex-col relative bg-gradient-to-b from-green-50/50 to-background">
      <SEO
        title="Payment Successful"
        description="Your payment is confirmed. Download your 100+ WhatsApp automation workflows instantly."
        keywords="payment success, whatsapp workflows download, order confirmed"
        url="https://syntheight.com/order/success/w4h8a2t5s9p3p7m1n6b0k-q2r8e7y4u1i3o5p9a6s"
      />
      <Header />
      <main className="flex-1 pt-24 pb-16">
        <div className="container-slate">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <div className="mb-6 flex justify-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                  className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/30"
                >
                  <CheckCircle className="w-14 h-14 text-white" />
                </motion.div>
              </div>

              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl md:text-4xl font-bold tracking-tight mb-3"
              >
                Payment Successful!
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-muted-foreground text-lg"
              >
                Thank you for your purchase. Your WhatsApp workflows are ready!
              </motion.p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white border border-gray-200 rounded-2xl p-8 mb-8 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold">Your Download is Ready</h2>
              </div>
              <p className="text-muted-foreground mb-6">
                Click the button below to access your 100+ WhatsApp Automation Workflows. The files are hosted on Google Drive for fast and reliable downloads.
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
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white border border-gray-200 rounded-2xl p-8 mb-8 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                </div>
                <h2 className="text-xl font-semibold">What's Included</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">100+ WhatsApp automation workflows</span>
                </div>
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">AI-powered chatbots with ChatGPT</span>
                </div>
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Multi-language support (Hinglish)</span>
                </div>
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Works with n8n platform</span>
                </div>
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">24/7 automated responses</span>
                </div>
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Lifetime access to all files</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-8 mb-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Basics You Must Know</h2>
                  <p className="text-sm text-muted-foreground">Watch this video to get started with WhatsApp automation</p>
                </div>
              </div>
              <div className="aspect-video rounded-xl overflow-hidden shadow-lg bg-black">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/dhhVxJ_qUPc?list=PLwdhOAfEpxTaHqf_o0waIy-EPz0PWEvFh"
                  title="WhatsApp Automation Getting Started Guide"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
              <p className="text-sm text-muted-foreground mt-4 text-center">
                Learn how to set up and use your WhatsApp automation workflows
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-white border border-gray-200 rounded-2xl p-6 mb-8 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-3">
                <HelpCircle className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium">Need Help?</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Having trouble downloading or setting up your WhatsApp workflows? Contact us at{' '}
                <a href="mailto:syntheight@gmail.com" className="text-blue-600 hover:underline font-medium">
                  syntheight@gmail.com
                </a>
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="text-center"
            >
              <Link to="/">
                <Button variant="outline" size="lg" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Home
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
