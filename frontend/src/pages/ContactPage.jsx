import React, { useState } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Mail } from 'lucide-react';
import { toast, Toaster } from 'sonner';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
    
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success('Message sent. We will respond within 24 hours.');
    setFormData({ name: '', email: '', message: '' });
    setIsSubmitting(false);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-24 pb-16">
        <div className="container-slate">
          <div className="max-w-xl">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Contact Us
            </h1>
            <p className="text-muted-foreground mb-10">
              Have a question? Send us a message.
            </p>
            
            {/* Email */}
            <div className="flex items-center gap-3 mb-10 p-4 bg-secondary">
              <Mail className="w-5 h-5" />
              <a
                href="mailto:syntheight@gmail.com"
                className="text-sm hover:underline"
              >
                syntheight@gmail.com
              </a>
            </div>
            
            {/* Contact Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm">Name</Label>
                <Input 
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={handleChange}
                  className="border-border bg-background"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm">Email</Label>
                <Input 
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="border-border bg-background"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message" className="text-sm">Message</Label>
                <Textarea 
                  id="message"
                  name="message"
                  placeholder="Your message..."
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  className="border-border bg-background resize-none"
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
          </div>
        </div>
      </main>
      <Footer />
      <Toaster position="top-center" />
    </div>
  );
}
