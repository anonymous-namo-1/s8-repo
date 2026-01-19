import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/button';
import { SEO } from '../components/SEO';
import { useAuth } from '../context/AuthContext';
import { templates, formatPrice } from '../data/templates';
import { Download, Lock, LogOut, Package, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast, Toaster } from 'sonner';

export default function MyAssetsPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading, logout, getDownloadLink } = useAuth();
  const [downloadingId, setDownloadingId] = useState(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [loading, isAuthenticated, navigate]);

  const handleDownload = async (templateId) => {
    setDownloadingId(templateId);
    try {
      const response = await getDownloadLink(templateId);
      if (response.success && response.download_url) {
        window.open(response.download_url, '_blank', 'noopener,noreferrer');
        toast.success('Download started!');
      } else {
        toast.error('Failed to get download link');
      }
    } catch (error) {
      toast.error('Failed to get download link. Please try again.');
    } finally {
      setDownloadingId(null);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Logged out successfully');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center pt-16">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  const purchasedTemplateIds = user?.purchases || [];

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="My Assets"
        description="Access your purchased workflows, templates, and download links."
        keywords="my assets, downloads, purchased workflows, syntheight"
        url="https://syntheight.com/my-assets"
      />
      <Header />
      <main className="flex-1 pt-20 pb-16">
        <div className="container-slate">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">My Assets</h1>
                <p className="text-muted-foreground">
                  Signed in as <span className="font-medium text-foreground">{user?.email}</span>
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="gap-2 self-start"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </div>

            {/* Stats */}
            <div className="flex gap-6 p-4 bg-secondary">
              <div>
                <p className="text-2xl font-bold">{purchasedTemplateIds.length}</p>
                <p className="text-xs text-muted-foreground">Products Owned</p>
              </div>
              <div className="w-px bg-border" />
              <div>
                <p className="text-2xl font-bold">{templates.length - purchasedTemplateIds.length}</p>
                <p className="text-xs text-muted-foreground">Available</p>
              </div>
            </div>
          </motion.div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {templates.map((template, index) => {
              const isPurchased = purchasedTemplateIds.includes(template.slug);
              const isDownloading = downloadingId === template.slug;

              return (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`border border-border bg-background p-6 ${
                    isPurchased ? '' : 'opacity-60'
                  }`}
                >
                  <div className="flex gap-5">
                    {/* Product Image */}
                    <div className="w-24 h-24 flex-shrink-0 bg-secondary overflow-hidden">
                      <img
                        src={template.image}
                        alt={template.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-semibold text-base truncate">{template.name}</h3>
                        {isPurchased ? (
                          <span className="flex-shrink-0 text-xs px-2 py-1 bg-green-100 text-green-700 font-medium">
                            Owned
                          </span>
                        ) : (
                          <span className="flex-shrink-0 text-xs px-2 py-1 bg-secondary text-muted-foreground font-medium">
                            {formatPrice(template.price)}
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {template.description}
                      </p>

                      {isPurchased ? (
                        <Button
                          variant="brutal"
                          size="sm"
                          onClick={() => handleDownload(template.slug)}
                          disabled={isDownloading}
                          className="gap-2"
                        >
                          <Download className="w-4 h-4" />
                          {isDownloading ? 'Opening...' : 'Download'}
                        </Button>
                      ) : (
                        <Link to={`/template/${template.slug}`}>
                          <Button variant="outline" size="sm" className="gap-2">
                            <Lock className="w-4 h-4" />
                            Buy Now
                            <ArrowRight className="w-3 h-3" />
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Empty State */}
          {purchasedTemplateIds.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center py-12 mt-6 border border-dashed border-border"
            >
              <Package className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No purchases yet</h3>
              <p className="text-sm text-muted-foreground mb-6">
                You haven't purchased any products yet. Browse our collection to get started.
              </p>
              <Link to="/workflows">
                <Button variant="brutal" className="gap-2">
                  Browse Products
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
      <Toaster position="top-center" />
    </div>
  );
}
