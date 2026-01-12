import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, Check } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Separator } from '../components/ui/separator';
import { getTemplateBySlug } from '../data/templates';
import { toast, Toaster } from 'sonner';

export default function CheckoutPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const template = getTemplateBySlug(slug);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    cardNumber: '',
    expiry: '',
    cvc: '',
    name: ''
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.cardNumber || !formData.expiry || !formData.cvc || !formData.name) {
      toast.error('Please fill in all fields');
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsProcessing(false);
    setIsComplete(true);
    toast.success('Payment successful!');
  };
  
  if (!template) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Template not found</h1>
            <Link to="/">
              <Button variant="brutal">Back to Templates</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (isComplete) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center py-24">
          <div className="container-brutal max-w-md text-center">
            <div className="w-16 h-16 bg-foreground text-background mx-auto mb-6 flex items-center justify-center">
              <Check className="w-8 h-8" strokeWidth={3} />
            </div>
            <h1 className="text-2xl font-bold mb-4">Purchase Complete</h1>
            <p className="text-muted-foreground mb-8">
              Thank you for your purchase. Your download link has been sent to {formData.email}
            </p>
            <div className="space-y-4">
              <Button variant="brutal" className="w-full" size="lg">
                Download Template
              </Button>
              <Link to="/">
                <Button variant="brutal-outline" className="w-full" size="lg">
                  Back to Templates
                </Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
        <Toaster position="top-center" />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Back Link */}
        <div className="container-brutal py-6">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>
        
        <div className="container-brutal pb-24">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-8">
              Checkout
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-12">
              {/* Form */}
              <div className="md:col-span-3">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="border-border bg-background"
                    />
                    <p className="text-xs text-muted-foreground">
                      Download link will be sent to this email
                    </p>
                  </div>
                  
                  <Separator />
                  
                  {/* Card Details */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Payment details</span>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="name">Name on card</Label>
                      <Input 
                        id="name"
                        name="name"
                        type="text"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleChange}
                        className="border-border bg-background"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card number</Label>
                      <Input 
                        id="cardNumber"
                        name="cardNumber"
                        type="text"
                        placeholder="4242 4242 4242 4242"
                        value={formData.cardNumber}
                        onChange={handleChange}
                        className="border-border bg-background"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Expiry</Label>
                        <Input 
                          id="expiry"
                          name="expiry"
                          type="text"
                          placeholder="MM/YY"
                          value={formData.expiry}
                          onChange={handleChange}
                          className="border-border bg-background"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvc">CVC</Label>
                        <Input 
                          id="cvc"
                          name="cvc"
                          type="text"
                          placeholder="123"
                          value={formData.cvc}
                          onChange={handleChange}
                          className="border-border bg-background"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    variant="brutal" 
                    size="xl" 
                    className="w-full"
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Processing...' : `Pay $${template.price}`}
                  </Button>
                  
                  <p className="text-xs text-center text-muted-foreground">
                    Secure payment. Your data is encrypted.
                  </p>
                </form>
              </div>
              
              {/* Order Summary */}
              <div className="md:col-span-2">
                <div className="bg-secondary p-6 space-y-4">
                  <h2 className="font-semibold">Order summary</h2>
                  
                  <div className="aspect-[4/3] overflow-hidden border border-border">
                    <img 
                      src={template.image} 
                      alt={template.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div>
                    <h3 className="font-medium">{template.name}</h3>
                    <p className="text-sm text-muted-foreground">{template.useCase}</p>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${template.price}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${template.price}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <Toaster position="top-center" />
    </div>
  );
}
