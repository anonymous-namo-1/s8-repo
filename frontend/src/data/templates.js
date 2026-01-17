// Syntheight - 10,000+ Automation Workflows
export const templates = [
  {
    id: 1,
    name: "10,000+ Automation Workflows",
    slug: "automation-workflows",
    useCase: "Ready-to-use automation workflows",
    bestFor: "Developers, businesses, and creators automating repetitive tasks",
    badge: "50% OFF - Limited Time",
    price: 99,
    originalPrice: 199,
    discount: 50,
    image: "/images/workflow-product.png",
    description: "The ultimate collection of 10,000+ pre-built automation workflows. From simple tasks to complex integrations, save hundreds of hours building automations from scratch.",
    notFor: "Those looking for no-code solutions without any technical setup.",
    customizeTime: "5-10 minutes per workflow",
    techStack: [],
    fileFormats: ["JSON", "Documentation"],
    includes: [
      "10,000+ ready-to-import workflow templates",
      "Categories: Marketing, Sales, HR, Finance, DevOps, Social Media & more",
      "Detailed documentation for each workflow",
      "Step-by-step setup instructions",
      "Regular updates with new workflows",
      "Lifetime access to all updates",
      "Searchable workflow database",
      "Community support access"
    ],
    refund: "14-day money-back guarantee if the workflows don't meet your expectations.",
    demoUrl: "#workflows-preview",
    featured: true
  },
  {
    id: 2,
    name: "100+ WhatsApp Automation Workflows",
    slug: "whatsapp-automation-workflows",
    useCase: "AI-powered WhatsApp chatbots and automation",
    bestFor: "Businesses wanting 24/7 automated customer support on WhatsApp",
    badge: "85% OFF - Limited Time",
    price: 29,
    originalPrice: 199,
    discount: 85,
    image: "/images/whatsapp-workflows-1.png",
    images: [
      "/images/whatsapp-workflows-1.png",
      "/images/whatsapp-workflows-2.png",
      "/images/whatsapp-workflows-3.png",
      "/images/whatsapp-workflows-4.png"
    ],
    description: "100+ ready-to-use WhatsApp automation workflows powered by ChatGPT. Let AI run your business 24/7 with instant responses in any language including Hinglish.",
    notFor: "Those not using n8n or similar automation platforms.",
    customizeTime: "5-10 minutes per workflow",
    techStack: ["n8n", "WhatsApp Business API", "ChatGPT", "OpenAI", "Google Gemini"],
    fileFormats: ["JSON"],
    includes: [
      "100+ ready-to-import WhatsApp automation workflows",
      "AI-powered chatbots with ChatGPT & GPT-4o integration",
      "Multi-language support including Hinglish",
      "Connect with WhatsApp, Email, Messenger, and more",
      "Restaurant, Salon, Sales, Travel & more business templates",
      "Intent recognition and smart routing",
      "No coding skills required",
      "Ready to use - just import and configure",
      "Works with n8n automation platform",
      "24/7 automated customer responses",
      "Instant reply capabilities",
      "Lifetime access to all templates"
    ],
    refund: "14-day money-back guarantee if the workflows don't meet your expectations.",
    demoUrl: "#whatsapp-preview",
    paymentUrl: "https://pages.razorpay.com/pl_S56PXg8UrFZCOO/view",
    featured: true
  }
];

export const getTemplateBySlug = (slug) => {
  return templates.find(t => t.slug === slug);
};

export const getFeaturedTemplates = () => {
  return templates.filter(t => t.featured);
};

// Format price in INR
export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
};
