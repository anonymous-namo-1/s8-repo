import React, { useState } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { SEO } from '../components/SEO';

import { toast, Toaster } from 'sonner';

export default function SupportPage() {
  const [formData, setFormData] = useState({
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.subject || !formData.message) {
      toast.error('Please fill in all fields');
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success('Message sent. We will respond within 24 hours.');
    setFormData({ email: '', subject: '', message: '' });
    setIsSubmitting(false);
  };
  
  return (
    <div className="min-h-screen flex flex-col relative">
      
      <SEO
        title="Support"
        description="Get help with Syntheight workflows and templates. We respond within 24 hours."
        keywords="support, help, syntheight, automation workflows"
        url="https://syntheight.com/support"
      />
      <Header />
      <main className="flex-1 py-16 md:py-24">
        <div className="container-slate">
          <div className="max-w-xl mx-auto">
            <div className="text-center mb-10">
              <span className="inline-block text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em] mb-4">
                Get Help
              </span>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Support
              </h1>
              <p className="text-lg text-muted-foreground">
                Need help? Send us a message and we will respond within 24 hours.
              </p>
            </div>
            
            <div className="form-card">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                  <Input 
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="h-12 rounded-xl border-border/60 bg-background transition-all duration-300 focus:shadow-[0_4px_20px_rgba(0,0,0,0.08)] focus:border-foreground/20"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-sm font-medium">Subject</Label>
                  <Input 
                    id="subject"
                    name="subject"
                    type="text"
                    placeholder="What do you need help with?"
                    value={formData.subject}
                    onChange={handleChange}
                    className="h-12 rounded-xl border-border/60 bg-background transition-all duration-300 focus:shadow-[0_4px_20px_rgba(0,0,0,0.08)] focus:border-foreground/20"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message" className="text-sm font-medium">Message</Label>
                  <Textarea 
                    id="message"
                    name="message"
                    placeholder="Describe your issue or question..."
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className="rounded-xl border-border/60 bg-background resize-none transition-all duration-300 focus:shadow-[0_4px_20px_rgba(0,0,0,0.08)] focus:border-foreground/20"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  variant="brutal" 
                  size="lg" 
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
              
              <p className="text-xs text-muted-foreground text-center mt-6">
                We respect your privacy. Your information will never be shared.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <Toaster position="top-center" />
    </div>
  );
}
