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
    license: "Personal and commercial use allowed. Use in unlimited projects. No redistribution or resale of the workflow collection.",
    licenseShort: "Unlimited personal & commercial use",
    refund: "14-day money-back guarantee if the workflows don't meet your expectations.",
    demoUrl: "#workflows-preview",
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
