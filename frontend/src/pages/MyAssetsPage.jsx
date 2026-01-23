import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/button';
import { SEO } from '../components/SEO';

import { useAuth } from '../context/AuthContext';
import { templates, formatPrice } from '../data/templates';
import { Download, Lock, LogOut, Package, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast, Toaster } from 'sonner';

export default function MyAssetsPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading, logout, getDownloadLink } = useAuth();
  const [downloadingId, setDownloadingId] = useState(null);

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
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="w-12 h-12 rounded-full border-2 border-foreground/20 border-t-foreground animate-spin" />
            <p className="text-muted-foreground text-sm">Loading your assets...</p>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const purchasedTemplateIds = user?.purchases || [];

  return (
    <div className="min-h-screen flex flex-col relative bg-gradient-to-b from-white via-gray-50/50 to-white">
      
      <SEO
        title="My Assets"
        description="Access your purchased workflows, templates, and download links."
        keywords="my assets, downloads, purchased workflows, syntheight"
        url="https://syntheight.com/my-assets"
      />
      <Header />
      <main className="flex-1 pt-24 pb-20">
        <div className="container-slate">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mb-12"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
              <div>
                <motion.h1 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                  className="text-4xl font-bold tracking-tight mb-3"
                >
                  My Assets
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="text-muted-foreground"
                >
                  Signed in as <span className="font-medium text-foreground">{user?.email}</span>
                </motion.p>
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.4 }}
              >
                <Button
                  variant="glass"
                  size="sm"
                  onClick={handleLogout}
                  className="gap-2 shadow-sm hover:shadow-md"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Button>
              </motion.div>
            </div>

            {/* Stats Section - Glassmorphism */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="grid grid-cols-2 gap-4 sm:flex sm:gap-6"
            >
              <div className="relative group p-6 bg-white/80 backdrop-blur-xl border border-black/5 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.1)] transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <span className="text-xs font-medium text-green-600 uppercase tracking-wider">Owned</span>
                  </div>
                  <p className="text-3xl font-bold tracking-tight">{purchasedTemplateIds.length}</p>
                  <p className="text-xs text-muted-foreground mt-1">Products in your library</p>
                </div>
              </div>
              
              <div className="relative group p-6 bg-white/80 backdrop-blur-xl border border-black/5 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.1)] transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-blue-600" />
                    <span className="text-xs font-medium text-blue-600 uppercase tracking-wider">Available</span>
                  </div>
                  <p className="text-3xl font-bold tracking-tight">{templates.length - purchasedTemplateIds.length}</p>
                  <p className="text-xs text-muted-foreground mt-1">More to explore</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Products Grid */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {templates.map((template, index) => {
              const isPurchased = purchasedTemplateIds.includes(template.slug);
              const isDownloading = downloadingId === template.slug;

              return (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 + index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  className={`group relative overflow-hidden bg-white/90 backdrop-blur-xl border rounded-2xl transition-all duration-500 ${
                    isPurchased 
                      ? 'border-green-200/50 shadow-[0_4px_24px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] hover:-translate-y-1' 
                      : 'border-black/5 opacity-75 hover:opacity-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]'
                  }`}
                >
                  {isPurchased && (
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/[0.03] via-transparent to-transparent pointer-events-none" />
                  )}
                  
                  <div className="relative p-6">
                    <div className="flex gap-5">
                      <div className="relative w-28 h-28 flex-shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50 shadow-inner">
                        <img
                          src={template.image}
                          alt={template.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        {isPurchased && (
                          <div className="absolute inset-0 bg-gradient-to-t from-green-900/20 to-transparent" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0 flex flex-col">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <h3 className="font-semibold text-lg truncate leading-tight">{template.name}</h3>
                          {isPurchased ? (
                            <span className="flex-shrink-0 inline-flex items-center gap-1.5 text-xs px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-full shadow-sm">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Owned
                            </span>
                          ) : (
                            <span className="flex-shrink-0 text-sm px-3 py-1.5 bg-gray-100 text-gray-600 font-medium rounded-full">
                              {formatPrice(template.price)}
                            </span>
                          )}
                        </div>

                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-grow">
                          {template.description}
                        </p>

                        {isPurchased ? (
                          <Button
                            variant="brutal"
                            size="sm"
                            onClick={() => handleDownload(template.slug)}
                            disabled={isDownloading}
                            className="gap-2 w-fit rounded-full shadow-md hover:shadow-lg"
                          >
                            {isDownloading ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Opening...
                              </>
                            ) : (
                              <>
                                <Download className="w-4 h-4" />
                                Download
                              </>
                            )}
                          </Button>
                        ) : (
                          <Link to={`/template/${template.slug}`}>
                            <Button variant="outline" size="sm" className="gap-2 rounded-full">
                              <Lock className="w-4 h-4" />
                              View Product
                              <ArrowRight className="w-3 h-3" />
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Empty State */}
          {purchasedTemplateIds.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="relative mt-12 overflow-hidden"
            >
              <div className="relative text-center py-16 px-8 bg-gradient-to-br from-white via-gray-50/50 to-white border border-dashed border-gray-200 rounded-3xl">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full blur-3xl" />
                
                <div className="relative">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.4 }}
                    className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl flex items-center justify-center shadow-inner"
                  >
                    <Package className="w-10 h-10 text-muted-foreground/50" />
                  </motion.div>
                  
                  <h3 className="text-xl font-semibold mb-3">No purchases yet</h3>
                  <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
                    You haven't purchased any products yet. Browse our collection to find automation workflows that will transform your business.
                  </p>
                  
                  <Link to="/workflows">
                    <Button variant="brutal" size="lg" className="gap-2 rounded-full shadow-lg hover:shadow-xl">
                      <Sparkles className="w-4 h-4" />
                      Browse Products
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
      <Toaster position="top-center" richColors />
    </div>
  );
}
