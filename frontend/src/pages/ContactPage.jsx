import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { SEO } from '../components/SEO';
import { Background3D } from '../components/Background3D';
import { Mail, Send, Clock, MessageSquare } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import api from '../utils/api';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all fields');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await api.post('/api/contact/submit', {
        name: formData.name.trim(),
        email: formData.email.trim(),
        message: formData.message.trim()
      });

      if (response.data.success) {
        toast.success(response.data.message || 'Message sent. We will respond within 24 hours.');
        setFormData({ name: '', email: '', message: '' });
      } else {
        toast.error(response.data.message || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Failed to send message. Please try again or email us directly.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background relative">
      <Background3D />
      <SEO
        title="Contact Syntheight"
        description="Reach out for support or questions about Syntheight workflows and templates. We typically respond within 24 hours."
        keywords="contact syntheight, workflow support, automation help, customer support"
        url="https://syntheight.com/contact"
      />
      <Header />
      <main className="flex-1 pt-28 sm:pt-24 pb-20">
        <div className="container-slate">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            {/* Left - Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-block text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em] mb-4">
                Get in touch
              </span>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                Contact Us
              </h1>
              <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
                Have a question or need help? We're here to assist you with any inquiries about our workflows.
              </p>

              {/* Contact Info Cards */}
              <div className="space-y-4">
                <div className="group p-5 border border-border bg-background hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)] transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-foreground/5 group-hover:bg-foreground group-hover:text-background flex items-center justify-center transition-all duration-300">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Email Us</h3>
                      <a
                        href="mailto:syntheight@gmail.com"
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        syntheight@gmail.com
                      </a>
                    </div>
                  </div>
                </div>

                <div className="group p-5 border border-border bg-background hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)] transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-foreground/5 group-hover:bg-foreground group-hover:text-background flex items-center justify-center transition-all duration-300">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Response Time</h3>
                      <p className="text-sm text-muted-foreground">
                        We typically respond within 24 hours
                      </p>
                    </div>
                  </div>
                </div>

                <div className="group p-5 border border-border bg-background hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)] transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-foreground/5 group-hover:bg-foreground group-hover:text-background flex items-center justify-center transition-all duration-300">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Support Scope</h3>
                      <p className="text-sm text-muted-foreground">
                        We help with setup and usage questions
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right - Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="p-8 sm:p-10 border border-border bg-background shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
                <h2 className="text-xl font-semibold mb-6">Send us a message</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">Name</Label>
                    <div className={`relative transition-all duration-300 ${focusedField === 'name' ? 'transform scale-[1.01]' : ''}`}>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Your name"
                        value={formData.name}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('name')}
                        onBlur={() => setFocusedField(null)}
                        className="h-12 border-border bg-background transition-all duration-300 focus:shadow-[0_4px_20px_rgba(0,0,0,0.08)] focus:border-foreground/30"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                    <div className={`relative transition-all duration-300 ${focusedField === 'email' ? 'transform scale-[1.01]' : ''}`}>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                        className="h-12 border-border bg-background transition-all duration-300 focus:shadow-[0_4px_20px_rgba(0,0,0,0.08)] focus:border-foreground/30"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-sm font-medium">Message</Label>
                    <div className={`relative transition-all duration-300 ${focusedField === 'message' ? 'transform scale-[1.01]' : ''}`}>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Tell us how we can help..."
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('message')}
                        onBlur={() => setFocusedField(null)}
                        className="border-border bg-background resize-none transition-all duration-300 focus:shadow-[0_4px_20px_rgba(0,0,0,0.08)] focus:border-foreground/30"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    variant="brutal"
                    size="lg"
                    className="w-full group"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span>Sending...</span>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <Send className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </>
                    )}
                  </Button>
                </form>

                <p className="text-xs text-muted-foreground text-center mt-6">
                  We respect your privacy. Your information will never be shared.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
      <Toaster position="top-center" />
    </div>
  );
}
